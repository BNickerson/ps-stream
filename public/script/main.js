$('#profileLink').click(function() {
    alert('Thanks for creating an account! Nothing exists here yet, but I have a lot planned!');
});

$('#close-chat').click(function() {
    closeChat();
});

var closeChat = function() {
    $('#player').removeClass('col-lg-8').addClass('col-lg-12');
    $('#chat').addClass('hide');
}
