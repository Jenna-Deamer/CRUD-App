//get markup
let totalIncomeHolder = document.getElementById('totalIncome');
let totalExpenseHolder = document.getElementById('totalExpense');
let totalSavedHolder = document.getElementById('totalSaved');

//set values
let totalExpense = 0;
let totalIncome = 0;

//get total expense & total income
transactionsData.forEach(function (transaction) {
    if (transaction.type === 'Expense') {
        totalExpense += transaction.amount;
    } else if (transaction.type === 'Income') {
        totalIncome += transaction.amount;
    }
});

//update index
totalIncomeHolder.textContent = totalIncome.toFixed(2);
totalExpenseHolder.textContent = totalExpense.toFixed(2);

//get saved
let saved = totalIncome - totalExpense;
totalSavedHolder.textContent = saved.toFixed(2);
