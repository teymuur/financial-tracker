let totalExpenses = parseFloat(getCookie('totalExpenses')) || 0;
let salary = parseFloat(getCookie('salary')) || 0;
document.getElementById('salaryInput').value = salary;
const d = document.getElementById("date");

//Max value for date is today

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
   dd = '0' + dd;
}

if (mm < 10) {
   mm = '0' + mm;
} 
today = yyyy + '-' + mm + '-' + dd;
    d.setAttribute("max",today);
    d.setAttribute('min',`2000-01-01`)
    d.value = today;

function addExpense() {
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    var date = document.getElementById('date').value;
    if(date.split('-')[0] < 2000 || date.split('-')[0] >yyyy){
      date = today;
      console.log(1)
    }
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
 
    document.getElementById('amount').value = '';

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

    // Update total expenses and render new rows
    totalExpenses = 0;
    expenses.forEach(expense => {
        totalExpenses += parseFloat(expense.amount);
        const newRow = expenseTable.insertRow(-1);
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.innerHTML = expense.category;
        cell2.innerHTML = `$${expense.amount}`;
        cell3.innerHTML = expense.date;

            // Add delete button
        const deleteButton = document.createElement('i');

        deleteButton.className = 'fa fa-trash-o';
        deleteButton.onclick = function () {
        deleteExpense(expense);
        };

            cell4.appendChild(deleteButton);
    });

    // Update total expenses display
    document.getElementById('totalAmount').textContent = totalExpenses.toFixed(2);
}
function deleteExpense(expense) {
  const expenseData = getCookie('expenseData') || '[]';
  const expenses = JSON.parse(expenseData);

  // Find and remove the expense
  const index = expenses.findIndex(e => e.category === expense.category && e.amount === expense.amount && e.date === expense.date);
  if (index !== -1) {
      expenses.splice(index, 1);
      setCookie('expenseData', JSON.stringify(expenses));

      // Update total expenses and re-render
      renderExpenseHistory();
  }
  updateRemainingMoney();
}

document.getElementById('salaryInput').addEventListener("input",updateSalary)


function setCookie(cname,cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (999999999));
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
  document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      readFile(file);
    }
  });

  function readFile(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const fileContent = e.target.result;
      setCookie("expenseData",fileContent);
      renderExpenseHistory();
      updateRemainingMoney();
    };

    reader.readAsText(file);
  }
  function saveToFile() {
    const content = getCookie("expenseData");

    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/plain' });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with the desired file name
    link.download = 'records.json';

    // Create a URL for the Blob and set it as the link's href
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  }
  renderExpenseHistory();
  updateRemainingMoney();