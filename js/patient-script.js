// Cart array to store selected items
let cart = [];

// Add item to cart
function addToCart(mealName) {
    // Convert meal name to lowercase and replace spaces with hyphens
    const quantityId = `${mealName.toLowerCase().replace(/ /g, '-')}-quantity`;
    const quantity = parseInt(document.getElementById(quantityId).value);

    // Check if the item is already in the cart
    const existingItemIndex = cart.findIndex(item => item.mealName === mealName);

    if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            mealName: mealName,
            quantity: quantity
        });
    }

    updateCartDisplay();
}


const mealPrices = {
    'Chicken Salad': 60,
    'Vegetable Soup': 42,
    'Fish with Rice': 67
};
// Update cart display
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalCostElement = document.getElementById('total-cost');
    cartItemsElement.innerHTML = '';

    let totalCost = 0; // Initialize total cost counter

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty.</p>';
        if (totalCostElement) {
            totalCostElement.textContent = '0.00';
        }
        return;
    }

    cart.forEach((item, index) => {
        // Calculate price for this specific item
        const itemPrice = mealPrices[item.mealName] || 0;
        const itemTotal = itemPrice * item.quantity;

        // Add to the overall total cost
        totalCost += itemTotal;

        // Create the list item element
        const cartItem = document.createElement('li');

        // Output the meal name, quantity, price, and add edit/remove buttons if you need them
        cartItem.innerHTML = `
            ${item.mealName} (Quantity: ${item.quantity}) - $${itemTotal.toFixed(2)}
            <button onclick="editCartItem(${index})" style="margin-left:10px; font-size:12px;">Edit</button>
            <button onclick="removeCartItem(${index})" style="margin-left:5px; font-size:12px;">Remove</button>
        `;

        cartItemsElement.appendChild(cartItem);
    });

    // Update the total cost display if the element exists in HTML
    if (totalCostElement) {
        totalCostElement.textContent = totalCost.toFixed(2);
    }
}

// Edit cart item quantity
function editCartItem(index) {
    const item = cart[index];
    const newQuantity = prompt(`Enter new quantity for ${item.mealName}:`, item.quantity);

    if (newQuantity !== null && !isNaN(newQuantity) && newQuantity > 0) {
        cart[index].quantity = parseInt(newQuantity);
        updateCartDisplay();
    }
}

// Remove cart item
function removeCartItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Toggle delivery details visibility
document.getElementById('delivery-option').addEventListener('change', function () {
    const deliveryDetailsGroup = document.getElementById('delivery-details-group');
    if (this.value === 'home-delivery') {
        deliveryDetailsGroup.style.display = 'block';
    } else {
        deliveryDetailsGroup.style.display = 'none';
    }
});

// Submit order with cart items
function submitOrder() {
    const mealDate = document.getElementById('meal-date').value;
    const mealTime = document.getElementById('meal-time').value;
    const dietaryRestrictions = document.getElementById('dietary-restrictions').value;
    const deliveryOption = document.getElementById('delivery-option').value;
    const deliveryDetails = document.getElementById('delivery-details').value;
    const room = localStorage.getItem('patientRoom');
    let finalTotalCost = 0;
    cart.forEach(item => {
        const itemPrice = mealPrices[item.mealName] || 0;
        finalTotalCost += (itemPrice * item.quantity);
    });
    if (!mealDate) {
        alert('Please select a date.');
        return;
    }

    if (!mealTime) {
        alert('Please select a meal time.');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart.');
        return;
    }

    if (deliveryOption === 'home-delivery' && !deliveryDetails) {
        alert('Please enter delivery details.');
        return;
    }

    // Format the date for display
    const formattedDate = new Date(mealDate).toLocaleDateString();

    // Create order summary
    let orderSummary = `Order for ${formattedDate} at ${mealTime} (Room ${room}):\n`;
    cart.forEach(item => {
        orderSummary += `- ${item.mealName} (Quantity: ${item.quantity})\n`;
    });
    orderSummary += `Delivery: ${deliveryOption === 'self-pickup' ? 'Self-Pickup' : 'Home Delivery'}\n`;
    if (deliveryOption === 'home-delivery') {
        orderSummary += `Delivery Details: ${deliveryDetails}\n`;
    }
    orderSummary += `Dietary Restrictions: ${dietaryRestrictions || 'No restrictions'}`;

    // Display the order in the patient's order list
    const orderItem = document.createElement('li');
    orderItem.textContent = orderSummary;
    document.getElementById('orders').appendChild(orderItem);

    // Store the order in localStorage
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    orders.push({
        mealDate: mealDate,
        mealTime: mealTime,
        cartItems: cart,
        room: room,
        deliveryOption: deliveryOption,
        deliveryDetails: deliveryOption === 'home-delivery' ? deliveryDetails : null,
        dietaryRestrictions: dietaryRestrictions || 'No restrictions',
        totalCost: finalTotalCost.toFixed(2), // Save cost here
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('pendingOrders', JSON.stringify(orders));
    saveOrderToHistory(room, mealTime, mealDate, cart, dietaryRestrictions, finalTotalCost.toFixed(2));

    // Clear the cart after submitting the order
    cart = [];
    updateCartDisplay();
    alert(`Order submitted! Total Cost: $${finalTotalCost.toFixed(2)}`);
}

window.onload = function () {
    changeLanguage();
    // Initialize cart display
    updateCartDisplay();
};


function saveOrderToHistory(roomNumber, mealTime, mealDate, cartItems, restrictions, totalCost) {
    let foodOrders = JSON.parse(localStorage.getItem('foodOrders')) || [];

    // Make sure we save the data using the exact variable names the Admin page expects
    const newOrder = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        roomNumber: roomNumber,
        mealTime: mealTime,
        mealDate: mealDate,
        items: cartItems, // Saves the actual cart array
        restrictions: restrictions || 'None',
        totalCost: totalCost, // Saves the calculated cost
        status: 'Completed'
    };

    foodOrders.push(newOrder);
    localStorage.setItem('foodOrders', JSON.stringify(foodOrders));
}
let isFontEnlarged = false;

function toggleFontSize() {
    const btn = document.getElementById('toggle-font-btn');
    const bodyElement = document.body;
    if (isFontEnlarged) {
        bodyElement.style.fontSize = '1em';
        btn.textContent = 'Aa Large Font (1.5x)';
        isFontEnlarged = false;
    } else {
        bodyElement.style.fontSize = '1.5em';
        btn.textContent = 'Aa Restore to default (1x)';
        btn.style.backgroundColor = '#f0ad4e';
        isFontEnlarged = true;
    }
}
let isSpeaking = false;
let isTapToReadActive = false;

function toggleTapToRead() {
    const btn = document.getElementById('tap-read-btn');

    if (isTapToReadActive) {

        isTapToReadActive = false;
        btn.textContent = '👆 Click to speech (off)';
        btn.style.backgroundColor = '#007bff';
        window.speechSynthesis.cancel();


        document.body.style.cursor = 'default';
    } else {

        isTapToReadActive = true;
        btn.textContent = '🛑 Click to speech (On)';
        btn.style.backgroundColor = '#dc3545';

        document.body.style.cursor = 'help';

        const utterance = new SpeechSynthesisUtterance("Click to speech activated You can click the word in the screen。");
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

// 3. Listen for clicks on the entire page
document.addEventListener('click', function (event) {
    if (!isTapToReadActive) return;
    if (event.target.id === 'tap-read-btn') return;

    const textToRead = event.target.innerText || event.target.textContent || event.target.value;

    if (textToRead && textToRead.trim() !== '') {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToRead.trim());


        const availableVoices = window.speechSynthesis.getVoices();

        const chineseVoice = availableVoices.find(voice =>
            voice.lang.includes('zh-HK') || voice.lang.includes('zh')
        );

        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        // --------------------------------------


        utterance.lang = 'zh-HK';


        utterance.rate = 0.9;

        window.speechSynthesis.speak(utterance);
    }
});

window.speechSynthesis.onvoiceschanged = function () {
    window.speechSynthesis.getVoices();
};