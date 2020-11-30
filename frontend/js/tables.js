
$(document).ready(function() {
    $('#datatable').DataTable();
} );
$('.collapse').collapse()
$(document).ready(function(){
  $(".btnBill").click(function(){
    $("#modalBill").modal();
  });
});
  $('#datatable').dataTable( {
    paging: false,
    info: false
} );
$(document).ready(function(){
  $("#addTable").click(function(){
    $("#modalAddTable").modal();
  });
});
$(document).ready(function(){
  $(".deleteTable").click(function(){
    $("#deleteModal").modal()
  });
});