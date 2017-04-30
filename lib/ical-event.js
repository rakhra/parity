var ical = require('ical-generator');
var constants = require('./constants');

var assignEventToCal = function(event, cal) {
  for(i=0; i < event.dates.length; i++) {
    var date = event.dates[i];
    var summary = `KNECT Event - ${event.name}`;

    if (i > 0) {
      summary += ` - Part ${i + 1}`;
    }

    var eventURL = `${constants.APP_URL}/event/${event._id}`;
    cal.createEvent({
      start: date.start,
      end: date.end,
      summary: summary,
      description: `The latest information regarding this KNECT event can be found at ${eventURL}`,
      location: event.location,
      url: eventURL,
      alarm: { trigger: 60 * 5 }
    });
  };
};

var icalEvent = function(event) {
  cal = ical({
    domain: 'knect.com',
    name: event.name,
    timezone: event.timezone || 'Asia/Singapore'
  });

  assignEventToCal(event, cal);

  return cal;
};

var icalEventFeed = function(events) {
  cal = ical({
    domain: 'knect.com',
    name: 'knect events feed',
    timezone: 'Asia/Singapore'
  });

  events.forEach(function(event) {
    assignEventToCal(event, cal);
  });
  
  return cal;
};

module.exports = { 
  icalEvent : icalEvent,
  icalEventFeed : icalEventFeed
};