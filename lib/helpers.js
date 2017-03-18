'use strict'

var moment = require('moment');
require('moment-duration-format');

module.exports = { 
  dateFormat : function(date, format) {
    return moment(date).format(format);
  },

  duration : function(before, after, format) {
    var mins = moment(after).diff(moment(before), "minutes");
    if (mins < 60)
      return moment.duration(mins, "minutes").format("m [min]");
    
    if (mins >= 60 && mins < (60 * 6)) 
      return moment.duration(mins, "minutes").format("h [hrs], m [min]");
    
    if (mins >= (60 * 6) && mins < (60 * 24)) 
      mins = (60 * 24);

    return moment.duration(mins, "minutes").format("d [day]");
  }
};