$(".robotCall").click(function () {
    if ($(this).text() == "Call") {
      $(this).removeClass("btn-success");
      $(this).addClass("btn-primary");
      $(this).text("Send");
    } else if ($(this).text() == "Send") {
      $(this).removeClass("btn-primary");
      $(this).addClass("btn-success");
      $(this).text("Call");
    }
    console.log($(this).text);
  });
  $(".order").on("click", function () {
    if ($(this).hasClass("btn-danger")) {
      $(this).removeClass("btn-danger");
      $(this).addClass("btn-warning");
    } else if ($(this).hasClass("btn-warning")) {
      $(this).removeClass("btn-warning");
      $(this).addClass("btn-success");
    }
    console.log($(this).text);
  });