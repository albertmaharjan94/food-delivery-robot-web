$(document).ready(function() {
    $('#datatable').DataTable();
} );
$(document).ready(function(){
  $("#addItem").click(function(){
    $("#modal").modal();
  });
});
$(document).ready(function(){
  $(".deleteItem").click(function(){
    $("#deleteModal").modal()
  });
});