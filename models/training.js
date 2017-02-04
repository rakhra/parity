var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: { type: String, require: true},
  description: { type: String, require: true},
  link: { type: String, require: false},
  vendor: { type: String, require: false},
  tags: { type : Array , "default" : [] }
});

module.exports = mongoose.model('Training', schema);
