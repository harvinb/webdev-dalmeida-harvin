var mongoose = require('mongoose');

var WidgetSchema = mongoose.Schema ({
  type: {type: String, enum: ['HEADING', 'IMAGE', 'YOUTUBE', 'HTML', 'INPUT']},
  _page: {type: mongoose.Schema.Types.ObjectId, ref: 'PageModel'},
  name: String,
  text: String,
  placeholder: String,
  description: String,
  url: String,
  width: String,
  height: String,
  rows: Number,
  size: Number,
  class: String,
  icon: String,
  deletable: Boolean,
  formatted: Boolean,
  dateCreated: Date
}, {collection: 'widget'});

module.exports = WidgetSchema;
