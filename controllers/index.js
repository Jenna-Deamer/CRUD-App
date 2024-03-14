let express = require('express');
let router = express.Router();

let axios = require('axios');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Budget App Home',
    
  });
});

/* GET /register => load static view */
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  });
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});



module.exports = router;