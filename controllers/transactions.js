let express = require("express");
let router = express.Router();
const moment = require('moment');

// global auth check
let authCheck = require('../authCheck');

// Transaction model for CRUD
let Transaction = require("../models/transaction");
const transaction = require("../models/transaction");

/* GET: /transaction => show dashboard page */
router.get("/", authCheck, async (req, res) => {
  try {
    // Fetch transaction data from db
    const transactions = await Transaction.find().sort({ date: -1 });
    //change formatting of transaction records using moment.js
    const formattedTransactions = transactions.map(transaction => {

      //format the date for every transaction in table using moment.js
      const formattedDate = moment(transaction.date).format('MM/DD/YYYY');
      
      //format currency for all records
      // const formattedAmount = '$' + moment(transaction.amount).format('0,0.00');

      /*return as an object. 
      "..." is used to clone props from original transaction object
      then override date & amount with newly formatted properties.
      */
      return {  
        ...transaction.toObject(),
        date: formattedDate
        };
    });


    //get totals for summary section 
    //set initial values
    let totalIncome = 0;
    let totalExpense = 0;

    //get total expense & total income
    transactions.forEach(function (transaction) {
      if (transaction.type === 'Expense') {
        totalExpense += transaction.amount;
      } else if (transaction.type === 'Income') {
        totalIncome += transaction.amount;
      }
    });
    //get saved
    let totalSaved = totalIncome - totalExpense;
    // Render the transaction dashboard (index.hbs) with the fetched data
    res.render("transactions/index", {
      title: "Dashboard",
      user: req.user,
      transactions: formattedTransactions,
      totalIncome: totalIncome,
      totalExpense: totalExpense
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching transactions:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET: /transactions/create => display new transaction form */
router.get("/create", authCheck, (req, res) => {
  res.render("transactions/create", {
    title: "Create New Transaction",
  });
});

/* POST: /transaction/create => process form submission to save new transaction*/
router.post("/create", authCheck, async (req, res) => {
  // use mongoose model to save new post to db
  await Transaction.create(req.body);

  // go back to dash
  res.redirect("/transactions");
});

/* GET: /transaction/edit/abc123 => display selected doc in form */
router.get("/edit/:_id", authCheck,  async (req, res) => {
  try {
    // get selected doc from db
    let transaction = await Transaction.findById(req.params._id);
    // load view & pass data
    res.render("transactions/edit", {
      title: "Edit Transaction",
      transaction: transaction,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching transaction for edit:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* POST: /transactions/edit/abc123 => updated doc from form submission */
router.post("/edit/:_id", authCheck, async (req, res) => {
  // update doc
  await Transaction.findByIdAndUpdate(req.params._id, req.body);
  // Redirect to the dashboard
  res.redirect("/transactions");

});

/* GET: /transactions/delete/abc123 => remove selected doc & redirect */
router.get('/delete/:_id', authCheck,  async (req, res) => {
  // delete selected doc based on _id in url param
  // get selected doc from db
  let transactionToDelete = await Transaction.findById(req.params._id);
  await transactionToDelete.deleteOne({ _id: transaction._id });
  // redirect
  res.redirect('/transactions');

});


// Export the router
module.exports = router;
