$(document).ready(function() {  
});

var impression = function(itemType, itemId, verb) {
  $.post("/impression/" + verb + "/" + itemType, {item_id :  itemId})
    .done(function(data) {
      location.reload();
    });
};


var removeImpression = function(itemId) {
  $.ajax({
    url: "/impression/" + itemId,
    type: 'DELETE',
    data: {}, 
    contentType:'application/json', 
    
    success: function(result) {
      location.reload();
    },
    
    error: function(result) {

    }
  });
};

