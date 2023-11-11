function addExpense() {
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;

    if (!category || !amount || !date) {
        alert('Please fill in all fields.');
        return;
    }

    const expenseTable = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    const newRow = expenseTable.insertRow(-1);

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    cell1.innerHTML = category;
    cell2.innerHTML = `$${amount}`;
    cell3.innerHTML = date;

    // You can add additional logic here, such as updating a total or checking against a budget.

    // Clear input fields
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
}