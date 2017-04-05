var Event = require('../../models/event');
var User = require('../../models/user');
var mongoose = require('mongoose');
var marked = require('marked');

mongoose.connect('localhost:27017/parity');

var user = User.findOne({});

var events = [
  new Event({
    name: 'The Event Loop',
    short_description: marked(
`Javascript is taking over the world. Node has made it possible to build web services that are written end to end in Javascript. But given the fact that Javascript is single threaded, how is it possible that we:

1. build such services that scale and perform well under heavy loads from multiple clients
2. discuss Javascript using terms such as 'asynchronous', 'conncurent' and 'non-blocking'

In this talk we will learn how asynchrous code actually get executed at runtime.`      
    ),

    description:  marked(

`Javascript is taking over the world. Node has made it possible to build web services that are written end to end in Javascript. But given the fact that Javascript is single threaded, how is it possible that we:

1. build such services that scale and perform well under heavy loads from multiple clients
2. discuss Javascript using terms such as 'asynchronous', 'conncurent' and 'non-blocking'

In this talk we will learn how asynchrous code actually get executed at runtime.`)
    
,host: marked(

      `Sandeep is a software engineer working in EDIT on systems that manage the firms 
    Japanese structured funds business. He is the current lead of the HK AD Job Family and is an advocate of 
    open software and knowledge.`
    
    ),
    link: '',
    organiser: 'Internal',
    tags: ['Talk', 'Javascript', 'Node', 'Software'],
    deleted: false,
    dates: [{start: new Date("April 5, 2017 16:00:00"),
      end: new Date("April 5, 2017 16:30:00")}],
    created_by: user._id,
    location: "Office",
    sponsor: "Office"
  }),
  new Event({
    name: 'Webconf.asia',
    short_description: marked(
    `Webconf.asia is a one day conference featuring awesome talks with practical advice from international web experts.`
      ),

    description: marked(
      `Webconf.asia is a one day conference featuring awesome talks with practical advice from international web experts.`
      ),
    link: 'https://webconf.asia/',
    organiser: 'Webconf.asia',
    tags: ['Conference', 'Web', 'Software'],
    deleted: false,
    dates: [{
      start: new Date("June 3, 2017 08:30:00"),
      end: new Date("June 3, 2017 23:59:59")}],
    created_by: user._id,
    location: "Hong Kong Federation of Youth Groups Building, 21 Pak Fuk Rd, North Point East, Hong Kong.",
    sponsor: null
  }),
  new Event({
    name: 'RISE Conf Hong Kong',
    short_description: marked(
    `RISE is produced by the team behind Web Summit. In 6 short years, Web Summit has become Europe’s largest tech conference which last year attracted 53,000 attendees from 136 countries around the world. 
      In July 2017, people from the world’s biggest companies and most exciting startups will come to Hong Kong to share their stories and experiences at RISE. They’ll be joined by major global media, hundreds of investors and thousands of attendees for three days of legendary networking.`
    ),
    description: marked(

      `RISE is produced by the team behind Web Summit. In 6 short years, Web Summit has become Europe’s largest tech conference which last year attracted 53,000 attendees from 136 countries around the world. 
    In July 2017, people from the world’s biggest companies and most exciting startups will come to Hong Kong to share their stories and experiences at RISE. They’ll be joined by major global media, hundreds of investors and thousands of attendees for three days of legendary networking.`

    ),
    link: 'https://riseconf.com/',
    organiser: 'RISE Conf',
    tags: ['Conference', 'Web', 'Software'],
    deleted: false,
    dates: [{
      start: new Date("July 11, 2017 08:30:00"),
      end: new Date("July 13, 2017 23:59:59")}],
    created_by: user._id,
    location: "Office",
    sponsor: null
  })
];

var done = 0;
for (var i = 0; i < events.length; i++) {
  events[i].save(function(err, result) {
    done++;
    if (done === events.length) {
      exit();
    }
  })
}

function exit() {
  mongoose.disconnect();
}

