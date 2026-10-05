document.addEventListener('DOMContentLoaded', loadFoodHistory);

function loadFoodHistory() {

    const storedOrders = JSON.parse(localStorage.getItem('foodOrders')) || [];
    const tableBody = document.getElementById('history-table-body');


    if (!tableBody) {
        console.error("Cannot find ID 'history-table-body' element，Please check");
        return;
    }

    tableBody.innerHTML = '';


    if (storedOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">There are no any record。</td></tr>';
        return;
    }


    storedOrders.forEach(order => {
        const row = document.createElement('tr');


        const displayCost = order.totalCost ? order.totalCost : '0.00';

        const timestamp = order.timestamp || 'Unknown Time';
        const roomNum = order.roomNumber || 'Unknown';
        const date = order.mealDate || 'Unknown Date';
        const time = order.mealTime || 'Unknown Time Slot';

        row.innerHTML = `
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${timestamp}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${roomNum}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${date} / ${time}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${formatItems(order.items)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; color: #d9534f;">$${displayCost}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${order.restrictions || '無'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; color: green; font-weight: bold;">${order.status || 'Completed'}</td>
        `;
        tableBody.appendChild(row);
    });
}


function formatItems(items) {
    if (!items || !Array.isArray(items) || items.length === 0) return 'No Item';
    return items.map(item => `${item.mealName} (x${item.quantity})`).join('<br>');
}