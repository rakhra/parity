var Training = require('../../models/training');
var User = require('../../models/user');
var mongoose = require('mongoose');
var marked = require('marked');

mongoose.connect('localhost:27017/parity');

var user = User.findOne({});

var trainings = [
  new Training({
    name: 'BDD cucumber training',
    description: marked(
      
      `In-house cucumber training course. Cucumber is the worlds most popular open source BDD tool, used by thousands of organisations and companies around the world. 
      Cucumber lets you keep specificaAons, automated tests and documentaAon in the same place - a single source of truth that never gets out of sync.`

      ),
    link: 'https://cucumber.io/training',
    organiser: 'Cucumber Inc',
    tags: ['BDD', 'Cucumber', 'TDD', 'Software'],
    deleted: false,
    dates: [{
      start: new Date("January 18, 2017 08:30:00"),
      end: new Date("January 20, 2017 23:59:59")}],
    created_by: user._id,
    sponsor: "Office",
    location: "location"
  }),

  new Training({
    name: 'Microservices YOW! DepthFirst Workshop',
    description:  marked(

      `A hands on 1 day workshop with industry expert Fred George. The focus of the workshop will be on:
Understanding how to design asynchronous service architectures
Creating small, yet functional, services rather than larger services,
Reducing coupling to the bare minimum (JSON packets with extra fields ignored), and
Debugging asynchronous systems.`

),
    link: 'https://www.eventbrite.com.au/e/yow-depthfirst-workshop-hong-kong-fred-george-microservices-apr-10-tickets-32312121425',
    organiser: 'YOW!',
    tags: ['Microservices', 'YOW', 'Software'],
    deleted: false,
    dates: [{
      start: new Date("April 10, 2017 08:30:00"),
      end:   new Date("April 10, 2017 17:00:00")}],
    created_by: user._id,
    sponsor: "Office",
    location: "Cliftons Hong Kong, Rooms 508-520, Hutchison House, 10 Harcourt Rd, Central"
  }),

  new Training({
    name: 'Designing Better Responsive Experiences Workshop',
    description:  marked(

      `In this full-day front-end workshop on Friday June 2 2017, Vitaly Friedman from Smashing Magazine will be providing you with smart and applicable solutions for your day to day responsive design problems.
    After this workshop you are able to:
    Come up with better solutions for complex responsive UX-design problems
    Use design patterns which are fast and scalable
    Implement a better responsive design workflow in your projects/company
    Who is this for?
    This workshop is intended for designers, developers and everybody else who is dealing with responsive design or wants to better understand responsive design in general. It helps if you are familiar with some basics of responsive design, HTML5 and CSS, but it's not a requirement.`

    ),
    link: 'https://webconf.asia/workshop',
    organiser: 'Webconf.asia',
    tags: ['Conference', 'Workshop', 'Web', 'Software'],
    deleted: false,
    dates: [{
      start: new Date("June 2, 2017 10:00:00"),
      end: new Date("June 2, 2017 18:00:00")}],
      location : "Hong Kong Federation of Youth Groups Building, 21 Pak Fuk Rd, North Point East, Hong Kong",
    created_by: user._id,
    sponsor: null
  }),
];

var done = 0;
for (var i = 0; i < trainings.length; i++) {
  trainings[i].save(function(err, result) {
    done++;
    if (done === trainings.length) {
      exit();
    }
  })
}

function exit() {
  mongoose.disconnect();
}

