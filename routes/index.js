var express = require('express');
var router = express.Router();
var Training = require('../models/training');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/training/', function(req, res, next) {
  Training.find(function(err, docs) {
    res.json(docs);  
  });
});

module.exports = router;
