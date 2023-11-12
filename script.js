let totalExpenses = parseFloat(getCookie('totalExpenses')) || 0;
let salary = parseFloat(getCookie('salary')) || 0;

function addExpense() {
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;

    if (!category || !amount || !date) {
        alert('Please fill in all fields.');
        return;
    }

    // Update total expenses
    totalExpenses += parseFloat(amount);
    document.getElementById('totalAmount').textContent = totalExpenses.toFixed(2);
    setCookie('totalExpenses', totalExpenses);

    // Update remaining money
    updateRemainingMoney();

    // Save expense to cookie
    const expenseData = getCookie('expenseData') || '[]';
    const expenses = JSON.parse(expenseData);
    expenses.push({ category, amount, date });
    setCookie('expenseData', JSON.stringify(expenses));

    // Render expense history
    renderExpenseHistory();

    // Clear input fields
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
}

function updateSalary() {
    salary = parseFloat(document.getElementById('salaryInput').value) || 0;
    setCookie('salary', salary);

    // Update remaining money
    updateRemainingMoney();


}

function updateRemainingMoney() {
    const remainingMoney = salary - totalExpenses;
    document.getElementById('remainingAmount').textContent = remainingMoney.toFixed(2);
}

function renderExpenseHistory() {
    const expenseTable = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    const expenseData = getCookie('expenseData') || '[]';
    const expenses = JSON.parse(expenseData);

    // Clear previous rows
    expenseTable.innerHTML = '';

    // Render new rows
    expenses.forEach(expense => {
        const newRow = expenseTable.insertRow(-1);
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);

        cell1.innerHTML = expense.category;
        cell2.innerHTML = `$${expense.amount}`;
        cell3.innerHTML = expense.date;
    });
}


document.getElementById('salaryInput').addEventListener("input",updateSalary)


function setCookie(cname,cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }