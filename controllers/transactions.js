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
    let totalIncome = 0;
    let totalExpense = 0;
    let transactions = []; // Initialize as empty

    // Check if user is logged in
    if (req.isAuthenticated()) {
      //get transactions for current logged in user. 
      transactions = await Transaction.find({ user: req.user._id }).sort({
        date: -1,
      });

      // Format transactions for logged-in users
      const formattedTransactions = transactions.map((transaction) => {
        const formattedDate = moment(transaction.date).format("MM/DD/YYYY");
        return { ...transaction.toObject(), date: formattedDate };
      });

      // calc totals for logged-in users
      transactions.forEach(function (transaction) {
        if (transaction.type === "Expense") {
          totalExpense += transaction.amount;
        } else if (transaction.type === "Income") {
          totalIncome += transaction.amount;
        }
      });

      // Render dashboard for logged-in users
      return res.render("transactions/index", {
        title: "Dashboard",
        user: req.user,
        transactions: formattedTransactions,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
      });
    } else {
      // If user is not logged in, fetch and render dummy data
      const dummyTransactions = await Transaction.find({ isMock: true }).sort({
        date: -1,
      });

      // Format dummy transactions
      const formattedDummyTransactions = dummyTransactions.map(
        (transaction) => {
          const formattedDate = moment(transaction.date).format("MM/DD/YYYY");
          return { ...transaction.toObject(), date: formattedDate };
        }
      );

      // calc totals for dummy data
      dummyTransactions.forEach(function (transaction) {
        if (transaction.type === "Expense") {
          totalExpense += transaction.amount;
        } else if (transaction.type === "Income") {
          totalIncome += transaction.amount;
        }
      });

      // Render dashboard with dummy data for non-logged-in users
      res.render("transactions/index", {
        title: "Dashboard",
        user: null,
        transactions: formattedDummyTransactions,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
      });
    }
  } catch (error) {
   
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

/* GET: /transactions/create => display new transaction form */
router.get("/create", authCheck, (req, res) => {
  res.render("transactions/create", {
    title: "Create New Transaction",
  });
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
      user: userId
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

/* POST: /transactions/edit/abc123 => updated doc from form submission */
router.post("/edit/:_id", authCheck, async (req, res) => {
  // update doc
  await Transaction.findByIdAndUpdate(req.params._id, req.body);
  // Redirect to the dashboard
  res.redirect("/transactions");
});

/* GET: /transactions/delete/abc123 => remove selected doc & redirect */
router.get("/delete/:_id", authCheck, async (req, res) => {
  try {
    // delete selected doc based on _id in url param
    // get selected doc from db
    await Transaction.deleteOne({ _id: req.params._id });
    // redirect
    res.redirect("/transactions");
  } catch (error) {
    // Handle errors
    console.error("Error deleting transaction:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Export the router
module.exports = router;
