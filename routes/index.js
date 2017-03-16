var express = require('express');
var router = express.Router();
var Training = require('../models/training');
var Vote = require('../models/vote');
var Event = require('../models/event');

var passport = require('passport');

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect : '/successjson', 
    failureRedirect : '/failurejson', 
    failureFlash : true 
}));

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect : '/successjson', 
    failureRedirect : '/failurejson', 
    failureFlash : true 
}));

router.get('/successjson', function(req, res) {
    res.json({ message: req.flash('info') });
});

router.get('/failurejson', function(req, res) {
    res.json({ message: req.flash('error') });
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/training/', function(req, res, next) {
  Training.find({ deleted : false }).sort( {updatedAt: -1} ).exec(function(err, training) {
    if (err) {
      res.status(500);
      return res.render('error', {error: err});
    }
    return res.json(training);
  });
});

router.post('/training', function(req, res, next) {
  var dates = req.body.dates.map(function(date) { return new Date(date); });

  var training = new Training({
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
    organiser: req.body.organiser,
    tags: req.body.tags,
    deleted: false,
    dates: dates
  });

  training.save(function(err, result) {
    if (err) {
      res.status(500);
      return res.render('error', { error: err });
    }
    Training.findById(training._id, function(err, training) {
      return res.json(training);
    });
  });
});

router.post('/vote', function(req, res, next) {
  var vote = new Vote({
    item: req.body.item,
    item_id: req.body.item_id
  });
  vote.save(function(err, result) {
    if (err) {
      res.status(500);
      return res.render('error', { error: err });
    }
    Vote.findById(vote._id, function(err, vote) {
      return res.json(vote);
    });
  });
});

router.delete('/vote/:id', function(req, res, next) {
  Vote.findOneAndUpdate(req.params.id, {$set: {deleted : true}}, {new : true}, function(err, updatedVote) {
    return res.json(updatedVote);
  });
});

router.get('/vote/:item', function(req, res, next) {
  Vote.find({ item : req.params.item, deleted : false }).sort( {updatedAt: -1} ).exec(function(err, votes) {
    if (err) {
      res.status(500);
      return res.render('error', {error: err});
    }
    return res.json(votes);
  });
});

router.get('/event/', function(req, res, next) {
  Event.find({ deleted : false }).sort( {updatedAt: -1} ).exec(function(err, event) {
    if (err) {
      res.status(500);
      return res.render('error', {error: err});
    }
    return res.json(event);
  });
});

router.post('/event', function(req, res, next) {
  var dates = req.body.dates.map(function(date) { return new Date(date); });

  var event = new Event({
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
    organiser: req.body.organiser,
    materials: req.body.materials,
    tags: req.body.tags,
    deleted: false,
    dates: dates
  });

  event.save(function(err, result) {
    if (err) {
      res.status(500);
      return res.render('error', { error: err });
    }
    Event.findById(event._id, function(err, event) {
      return res.json(event);
    });
  });
});

module.exports = router;
