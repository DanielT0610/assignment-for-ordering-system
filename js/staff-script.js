// Wait for the entire page to load before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- This part loads your existing orders when the page opens ---
    loadPendingOrders();
    // Assuming changeLanguage() is in another file, otherwise call it here too.
    // changeLanguage(); 


    // --- New Code: This section handles the "Update Price" form ---
    const updatePriceForm = document.getElementById('update-price-form');
    if (updatePriceForm) {
        updatePriceForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevents the page from reloading

            const foodId = document.getElementById('foodIdToUpdate').value;
            const newPrice = parseFloat(document.getElementById('newPrice').value);

            if (!foodId || isNaN(newPrice)) {
                alert('Please enter a valid Food ID and a new price.');
                return;
            }

            // In a real application, you would send this to a server.
            // For now, we update the menu stored in localStorage.
            let menu = JSON.parse(localStorage.getItem('menu')) || [];
            const foodIndex = menu.findIndex(item => item.id == foodId);

            if (foodIndex > -1) {
                // Update the price of the found food item
                menu[foodIndex].price = newPrice;
                // Save the entire updated menu back to localStorage
                localStorage.setItem('menu', JSON.stringify(menu));
                alert(`Successfully updated price for Food ID ${foodId}!`);
            } else {
                alert(`Error: Food with ID ${foodId} not found.`);
            }

            // Clear the form fields after submission
            updatePriceForm.reset();
        });
    }
});


// --- Your existing functions are below ---

function addMeal() {
    const meal = document.getElementById('meal-management').value;
    if (meal) {
        const mealItem = document.createElement('li');
        mealItem.innerHTML = `${meal} <button class="btn" onclick="removeMeal(this)">Remove</button>`;
        document.getElementById('staff-meals').appendChild(mealItem);
        document.getElementById('meal-management').value = '';
        alert('Meal added!');
    } else {
        alert('Please enter a meal name.');
    }
}

// Added a simple removeMeal function to prevent errors when the button is clicked
function removeMeal(button) {
    button.parentElement.remove();
}

function loadPendingOrders() {
    // Note: You are loading 'pendingOrders', make sure this is where your orders are stored.
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    const staffOrdersList = document.getElementById('staff-orders');
    
    staffOrdersList.innerHTML = ''; // Clear the list before adding new items

    if (orders.length === 0) {
        const noOrdersItem = document.createElement('li');
        noOrdersItem.textContent = 'No pending orders.';
        staffOrdersList.appendChild(noOrdersItem);
    } else {
        orders.forEach(order => {
            const formattedDate = new Date(order.mealDate).toLocaleDateString();
            const orderItem = document.createElement('li');
            
            // Using a <pre> tag helps preserve the line breaks and formatting
            let orderContent = `<pre>`;
            orderContent += `Order for ${formattedDate} at ${order.mealTime} (Room ${order.room}):\n`;
            order.cartItems.forEach(item => {
                orderContent += `- ${item.mealName} (Quantity: ${item.quantity})\n`;
            });
            orderContent += `Delivery: ${order.deliveryOption === 'self-pickup' ? 'Self-Pickup' : 'Home Delivery'}\n`;
            if (order.deliveryOption === 'home-delivery') {
                orderContent += `Delivery Details: ${order.deliveryDetails}\n`;
            }
            orderContent += `Dietary Restrictions: ${order.dietaryRestrictions}\n`;
            orderContent += `Timestamp: (${order.timestamp})`;
            orderContent += `</pre>`;
            
            orderItem.innerHTML = orderContent;
            staffOrdersList.appendChild(orderItem);
        });
    }
}
