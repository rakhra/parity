var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  link: { type: String, require: false },
  organiser: { type: String, require: false },
  materials: { type: Object, require: false },
  tags: { type : Array , "default" : [] },
  deleted: { type : Boolean, "default" : false },
  dates: { type : Array, "default" : [] }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Event', schema);