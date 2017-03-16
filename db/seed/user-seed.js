var User = require('../../models/user');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/parity');

var users = [
  new User({
    email: 'email',
    password: '$2a$05$2qT8qD1Vi9Ez7QKg6zl6YeCTddQWhUKKbbhfHgowAxI2RjHEMC/Xe'
  })
];

var done = 0;
for (var i = 0; i < users.length; i++) {
  users[i].save(function(err, result) {
    done++;
    if (done === users.length) {
      exit();
    }
  })
}

function exit() {
  mongoose.disconnect();
}
