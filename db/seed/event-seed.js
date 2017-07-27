var Event = require('../../models/event');
var User = require('../../models/user');
var mongoose = require('mongoose');
var marked = require('marked');

mongoose.connect('localhost:27017/parity');

var user = User.findOne({});

var yaml = require('js-yaml');
var fs = require('fs');

var eventDataFile = __dirname + '/data/events.yml';


var events = yaml.safeLoad(fs.readFileSync(eventDataFile, 'utf8')).events;


events.forEach(function(event) {
  event.short_description = marked(event.short_description);
  event.description = marked(event.description);
  event.host = marked(event.host);

  event.dates.forEach(function(date) {
    date.start = new Date(date.start);
    date.end = new Date(date.end);
  });
});


var done = 0;
for (var i = 0; i < events.length; i++) {
  var event = Event(events[i]);

  event.save(function(err, result) {
    done++;
    if (done === events.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

