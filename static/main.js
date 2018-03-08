function display_status_message(message){
    //var message_div = $( '<div class="status-message" style="top: ' + String($(".status-message").length + 1) + 'px;">' + message + '</div>' );
    var message_div = $( '<div class="status-message">' + message + '</div>' );
    $("#status-message-div").append( message_div );
    var last_status_message = $(".status-message")[$(".status-message").length - 1];
    setTimeout(function(){
        last_status_message.remove();
    }, 5000);
}
