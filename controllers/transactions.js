let express = require('express');
let router = express.Router();

// Transaction model for CRUD
let Transaction = require('../models/transaction');

/* GET: /transaction => show dashboard page */
router.get('/', async (req, res) => {
    try {
        // Fetch transaction data from the database
        const transactions = await Transaction.find().sort({ date: -1 });

        // Render the transaction dashboard (index.hbs) with the fetched data
        res.render('transactions/index', {
            title: 'Dashboard',
            transactions: transactions
        });
    } catch (error) {
        // Handle errors
        console.error('Error fetching transactions:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Export the router
module.exports = router;