var Training = require('../../models/training');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/parity');

var trainings = [
  new Training({
    name: 'BDD cucumber training',
    description: 'In-house cucumber training course. Cucumber is the worlds most popular open source BDD tool, used by thousands of organisations and companies around the world. Cucumber lets you keep specificaAons, automated tests and documentaAon in the same place - a single source of truth that never gets out of sync.',
    link: 'https://cucumber.io/training',
    organiser: 'cucumber inc',
    tags: ['BDD', 'Cucumber', 'TDD', 'Software'],
    deleted: false,
    dates: [new Date()]
  })
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
