var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  deleted: { type : Boolean, "default" : false },
  item: { type : String },
  item_id: { type : String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Vote', schema);
