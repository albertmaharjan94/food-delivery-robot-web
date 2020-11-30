$(document).ready(function() {
    $('#datatable').DataTable();
} );
$('.collapse').collapse()
$(document).ready(function(){
  $(".btnBill").click(function(){
    $("#modal").modal();
  });
});
  $('#datatable').dataTable( {
    paging: false,
    info: false
} );
$(document).ready(function(){
  $(".deleteOrder").click(function(){
    $("#deleteModal").modal()
  });
});