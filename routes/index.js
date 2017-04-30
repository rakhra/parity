var express = require('express');
var router = express.Router();
var Training = require('../models/training');
var Impression = require('../models/impression');
var Event = require('../models/event');

var passport = require('passport');
var marked = require('marked');

var icalEvent = require('../lib/ical-event');

var chunk = function(arr, chunkSize) {
  var output = [];
  for (var i=0; i<arr.length; i+=chunkSize) {
      output.push(arr.slice(i, i+chunkSize));
  }
  return output;
};


router.post('/training', isLoggedIn, function(req, res, next) {
  var dates = req.body.dates.map(function(date) { return new Date(date); });

  var training = new Training({
    name: req.body.name,
    description: marked(req.body.description),
    link: req.body.link,
    organiser: req.body.organiser,
    tags: req.body.tags,
    deleted: false,
    dates: dates,
    created_by: req.user._id
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

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect : '/success', 
    failureRedirect : '/failure', 
    failureFlash : true 
}));

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect : '/success', 
    failureRedirect : '/failure', 
    failureFlash : true 
}));

router.get('/signin', function(req, res, next) {
  return res.render('user/signin', {});
});

router.get('/success', function(req, res) {
    res.json({ pass: req.flash('info'), user: req.user.email });
});

router.get('/failure', function(req, res) {
    res.json({ message: req.flash('error') });
});

router.get('/event/:id', function(req, res, next) {
  var event = null;
  var impressions = null;

  Event.findById(req.params.id)
  .then(function(output) {
    event = output.toObject();
    event.type = "Event";
    return event;
  })
  .then(function() {
    return Impression.findOne({
      deleted : false, 
      created_by: req.user._id,
      item: "Event",
      item_id : event._id,
      verb: "register"});
  })
  .then(function(output) {
    var finalEvent = event;
    if (output != null) {
      finalEvent = Object.assign({register: output}, event);  
    }
    
    return res.render('event', { event: finalEvent });
  })
  .catch(function(err) {
    res.status(500);
    return res.render('error', {error: err});
  });
});

router.get('/about', function(req, res, next) {
  return res.render('about', { });
});

router.get('/', function(req, res, next) {
  var user = req.user._id;
  var trainings = [];
  var events = [];
  var impressions = [];

  
  Impression.find({deleted : false, created_by: req.user._id})
  .then(function(output) {
    impressions = output;
    return impressions;
  })
  .then(function() {
    return Training.find({deleted : false});
  })
  .then(function(output) {
    trainings = output.map(function(training) {
      var additions = {};

      additions.type = "Training";

      additions.register = impressions.find(function(item) {
        item.item_id == training._id && item.verb == 'register' 
          && item.item == additions.type;
      });
      
      additions.like = impressions.find(function(item) {
        item.item_id == training._id && item.verb == 'like' 
          && item.item == additions.type;
      });

      return Object.assign(additions, training.toObject());
    });
    
    return trainings;
  })
  .then(function() {
    return Event.find({ deleted : false});
  })
  .then(function(output) {
    events = output.map(function(event) {
      var additions = {};

      additions.type = "Event";

      additions.register = impressions.find(function(item) {
        return item.item_id == event._id && item.verb == 'register' && item.item == additions.type;
      });
      
      additions.like = impressions.find(function(item) {
        return item.item_id == event._id && item.verb == 'like' && item.item == additions.type;
      });

      return Object.assign(additions, event.toObject());
    });
       

    

    return events;
  })
  .then(function() {
    var eventsAndTrainings = events.concat(trainings);

    var chunks = chunk(eventsAndTrainings, 2);
    

    return res.render('index', { 
      eventsAndTrainings : eventsAndTrainings,
      eventsAndTrainingsSplit : chunks,
      user : req.user });
  })
  .catch(function(err) {
    res.status(500);
    return res.render('error', {error: err});
  });
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


router.post('/impression/:verb/:item', isLoggedIn, function(req, res, next) {
  var impression = new Impression({
    item: req.params.item,
    item_id: req.body.item_id,
    verb: req.params.verb,
    created_by: req.user._id
  });
  impression.save(function(err, result) {
    if (err) {
      res.status(500);
      return res.render('error', { error: err });
    }
    Impression.findById(result._id, function(err, impression) {
      return res.json(impression);
    });
  });
});


router.delete('/impression/:id', isLoggedIn, function(req, res, next) {
  Impression.findOneAndUpdate( {_id: req.params.id }, 
    {$set: {deleted : true}}, {upsert: true, new : true}, 
    function(err, updatedImpression) {
      
    return res.json(updatedImpression);
  });
});


router.get('/impression/:verb/:item', isLoggedIn, function(req, res, next) {
  Impression.find({ item : req.params.item, verb : req.params.verb, deleted : false }).sort( {updatedAt: -1} ).exec(function(err, impressions) {
    if (err) {
      res.status(500);
      return res.render('error', {error: err});
    }
    return res.json(impressions);
  });
});


router.get('/impression/', isLoggedIn, function(req, res, next) {
  Impression.find({ created_by: req.user._id, verb : req.params.verb, deleted : false }).sort( {updatedAt: -1} ).exec(function(err, impressions) {
    if (err) {
      res.status(500);
      return res.render('error', {error: err});
    }
    return res.json(impressions);
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

router.post('/event', isLoggedIn, function(req, res, next) {
  var dates = req.body.dates.map(function(date) { return new Date(date); });

  var event = new Event({
    name: req.body.name,
    description: marked(req.body.description),
    link: req.body.link,
    organiser: req.body.organiser,
    materials: req.body.materials,
    tags: req.body.tags,
    deleted: false,
    dates: dates,
    created_by: req.user._id
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

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


router.get('/calendar/event', function(req, res, next) {
  Event.find({ deleted : false}).sort( {updatedAt: -1} )
  .then(function(events) {
    events = events.map(function(e) {return e.toObject();});
    var ical = icalEvent.icalEventFeed(events);
    return ical.serve(res);  
  })
  .catch(function(err) {
    res.status(500);
    return res.render('error', {error: err});
  });
});


router.get('/calendar/event/:id', function(req, res, next) {
  //event ical invite
  Event.findById(req.params.id)
  .then(function(event) {
    var ical = icalEvent.icalEvent(event.toObject());
    ical.serve(res);
  })
  .catch(function(err) {
    res.status(500);
    return res.render('error', {error: err});
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "unauthenticated");
  res.redirect('/failurejson');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "already authenticated");
  res.redirect('/failurejson');
}

module.exports = router;
