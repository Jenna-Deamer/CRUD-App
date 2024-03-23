const moment = require("moment");
const express = require("express");
const router = express.Router();

// Global auth check
const authCheck = require("../authCheck");

// Transaction model for CRUD
const Transaction = require("../models/transaction");

/* GET: /transaction => show dashboard page */
router.get("/", authCheck, async (req, res) => {
  try {
    // Initialize vars for totals
    let totalIncome = 0;
    let totalExpense = 0;
    let transactions = []; //initialize as empty

    // Check if user is logged in & display & format their records
    if (req.isAuthenticated()) {
      // Fetch transaction data from db for current logged in user
      transactions = await Transaction.find({ user: req.user._id }).sort({
        date: -1,
      });

      // Change formatting of transaction records using moment.js
      const formattedTransactions = transactions.map((transaction) => {
        // Format the date for every transaction in table using moment.js
        const formattedDate = moment(transaction.date).format("MM/DD/YYYY");
        return {
          ...transaction.toObject(),
          date: formattedDate,
        };
      });

      // Get total expense & total income
      transactions.forEach(function (transaction) {
        if (transaction.type === "Expense") {
          totalExpense += transaction.amount;
        } else if (transaction.type === "Income") {
          totalIncome += transaction.amount;
        }
      });

      // Render the transaction dashboard (index.hbs) w/ logged in users data
      return res.render("transactions/index", {
        title: "Dashboard",
        user: req.user,
        transactions: formattedTransactions,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
      });
    } //end of if

    // Generate dummy data for non-logged-in users
    const dummyTransactions = [
      {
        date: "03/22/2024",
        description: "Dummy Expense",
        amount: 50,
        type: "Expense",
      },
      {
        date: "03/21/2024",
        description: "Dummy Income",
        amount: 100,
        type: "Income",
      },
    ];

    // Calculate total income & total expense for dummyData
    dummyTransactions.forEach(function (transaction) {
      if (transaction.type === "Expense") {
        totalExpense += transaction.amount;
      } else if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      }
    });

    // Render dashboard with dummydata for non-logged in users
    res.render("transactions/index", {
      title: "Dashboard",
      user: null, // Non-logged-in users do not have a user field
      transactions: dummyTransactions,
      totalIncome: totalIncome,
      totalExpense: totalExpense,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching transactions:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* POST: /transaction/create => process form submission to save new transaction*/
router.post("/create", authCheck, async (req, res) => {
  try {
    //create transactions under the user. Only transactions current user made will display for them.
    // Get user ID from the authenticated user
    const userId = req.user._id;
    /*req.body was not populating user Field
     Create Transaction with all fields listed out manually*/
    const newTransaction = new Transaction({
      type: req.body.type,
      name: req.body.name,
      amount: req.body.amount,
      description: req.body.description,
      user: userId,
    });

    // Save the transaction to the db
    await newTransaction.save();

    // Redirect back to dashboard after creating the transaction
    res.redirect("/transactions");
  } catch (error) {
    // Handle errors
    console.error("Error creating transaction:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET: /transaction/edit/abc123 => display selected doc in form */
router.get("/edit/:_id", authCheck, async (req, res) => {
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
router.get("/delete/:_id", authCheck, async (req, res) => {
  // delete selected doc based on _id in url param
  // get selected doc from db
  let transactionToDelete = await Transaction.findById(req.params._id);
  await transactionToDelete.deleteOne({ _id: transaction._id });
  // redirect
  res.redirect("/transactions");
});

// Export the router
module.exports = router;
