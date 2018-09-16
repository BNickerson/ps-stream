var socket = io('http://localhost:3000');
socket.on('news', function (data) {
    $('#socket-message').html(data.message);
    $('#alert-wrapper').fadeIn(1500).delay(data.delay ? data.delay : 5000).fadeOut(1500);
});
socket.on('viewers', function (viewers) {
    $('#viewer-count').html('| ' + viewers + ' views');
});