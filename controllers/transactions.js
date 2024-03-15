let express = require("express");
let router = express.Router();

// Transaction model for CRUD
let Transaction = require("../models/transaction");

/* GET: /transaction => show dashboard page */
router.get("/", async (req, res) => {
  try {
    // Fetch transaction data from the database
    const transactions = await Transaction.find().sort({ date: -1 });

    // Render the transaction dashboard (index.hbs) with the fetched data
    res.render("transactions/index", {
      title: "Dashboard",
      transactions: transactions,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching transactions:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET: /transactions/create => display new transaction form */
router.get("/create", (req, res) => {
  res.render("transactions/create", {
    title: "Create New Transaction",
  });
});

/* POST: /transaction/create => process form submission to save new transaction*/
router.post("/create", async (req, res) => {
  // use mongoose model to save new post to db
  await Transaction.create(req.body);

  // go back to the create form
  res.redirect("/transactions/create");
});

/* GET: /transaction/edit/abc123 => display selected doc in form */
router.get("/edit/:_id", async (req, res) => {
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
router.post("/edit/:_id", async (req, res) => {
    // update doc
    await Transaction.findByIdAndUpdate(req.params._id, req.body);
    // Redirect to the dashboard
    res.redirect("/transactions");
 
});

// Export the router
module.exports = router;
