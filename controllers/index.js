let express = require('express');
let router = express.Router();

let axios = require('axios');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Budget App Home',
    user: req.user
    
  });
});

/* GET /register => load static view */
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    user: req.user
  });
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    user: req.user
  });
});



module.exports = router;