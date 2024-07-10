let totalExpenses = parseFloat(getCookie('totalExpenses')) || 0;
let salary = parseFloat(getCookie('salary')) || 0;
document.getElementById('salaryInput').value = salary;
const d = document.getElementById("date");

// Max value for date is today
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; // January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
   dd = '0' + dd;
}

if (mm < 10) {
   mm = '0' + mm;
} 
today = yyyy + '-' + mm + '-' + dd;
d.setAttribute("max", today);
d.setAttribute('min', '2000-01-01');
d.value = today;

document.getElementById('category').addEventListener('change', function() {
    const otherCategoryDiv = document.getElementById('otherCategoryDiv');
    if (this.value === 'other') {
        otherCategoryDiv.style.display = 'block';
    } else {
        otherCategoryDiv.style.display = 'none';
        document.getElementById('otherCategory').value = '';
    }
});

function addExpense() {
    let category = document.getElementById('category').value;
    const otherCategory = document.getElementById('otherCategory').value;
    const amount = document.getElementById('amount').value;
    var date = document.getElementById('date').value;

    if (category === 'other' && otherCategory) {
        category = otherCategory;
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

    // Update charts
    updateCharts();

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
        deleteButton.onclick = function() {
            deleteExpense(expense);
        };
        cell4.appendChild(deleteButton);
    });

    // Update total expenses display
    document.getElementById('totalAmount').textContent = totalExpenses.toFixed(2);

    // Update charts
    updateCharts();
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

document.getElementById('salaryInput').addEventListener("input", updateSalary);

function setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (999999999));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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
        setCookie("expenseData", fileContent);
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

const ctx = document.getElementById('expenseChart').getContext('2d');
const ctxWeekly = document.getElementById('weeklyChart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Expenses',
            data: [],
            backgroundColor: [
                'rgba(150, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
                'rgba(150, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true
    }
});

// Function to calculate the week number relative to the earliest date
function getWeekNumber(date, start) {
  const diff = (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000) / 86400000;
  return Math.floor((diff + start.getDay() + 1) / 7)+1;
}

let weeklyChart = new Chart(ctxWeekly, {
  type: 'bar',
  data: {
      labels: [],
      datasets: []
  },
  options: {
      responsive: true,
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
});

function updateCharts() {
  const expenseData = getCookie('expenseData') || '[]';
  const expenses = JSON.parse(expenseData);

  // Update pie chart
  const categoryTotals = expenses.reduce((totals, expense) => {
      if (!totals[expense.category]) {
          totals[expense.category] = 0;
      }
      totals[expense.category] += parseFloat(expense.amount);
      return totals;
  }, {});

  const pieLabels = Object.keys(categoryTotals);
  const pieData = Object.values(categoryTotals);

  expenseChart.data.labels = pieLabels;
  expenseChart.data.datasets[0].data = pieData;
  expenseChart.update();

  // Calculate the earliest date
  const earliestDate = expenses.reduce((earliest, expense) => {
      const expenseDate = new Date(expense.date);
      return (earliest === null || expenseDate < earliest) ? expenseDate : earliest;
  }, null);

  // Update bar chart
  const weeklyTotals = {};

  expenses.forEach(expense => {
      const date = new Date(expense.date);
      const week = getWeekNumber(date, earliestDate);

      if (!weeklyTotals[week]) {
          weeklyTotals[week] = {};
      }

      if (!weeklyTotals[week][expense.category]) {
          weeklyTotals[week][expense.category] = 0;
      }

      weeklyTotals[week][expense.category] += parseFloat(expense.amount);
  });

  const barLabels = Object.keys(weeklyTotals).map(week => `Week ${week}`);
  const categoryColors = expenseChart.data.datasets[0].backgroundColor;
  const datasets = pieLabels.map((category, index) => ({
      label: category,
      data: barLabels.map((label, weekIndex) => {
          const week = weekIndex + 1;
          return weeklyTotals[week] ? weeklyTotals[week][category] || 0 : 0;
      }),
      backgroundColor: categoryColors[index],
      borderColor: categoryColors[index],
      borderWidth: 1
  }));

  weeklyChart.data.labels = barLabels;
  weeklyChart.data.datasets = datasets;
  weeklyChart.update();
}
function confirmReset() {
  if (confirm('Are you sure to reset all data? Make sure to export your data before resetting.')) {
      resetAllData();
  }
}

function resetAllData() {
  // Clear all cookies
  document.cookie = 'totalExpenses=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'salary=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'expenseData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Reset UI elements
  totalExpenses = 0;
  salary = 0;
  document.getElementById('salaryInput').value = '';
  document.getElementById('totalAmount').textContent = '0.00';
  document.getElementById('remainingAmount').textContent = '0.00';
  renderExpenseHistory();
  updateRemainingMoney();
}

renderExpenseHistory();
updateRemainingMoney();
updateCharts();
