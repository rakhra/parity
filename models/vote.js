var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  deleted: { type : Boolean, "default" : false },
  item: { type : String, require: true },
  item_id: { type : String, require: true },
  created_by: { type : String, require: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Vote', schema);
