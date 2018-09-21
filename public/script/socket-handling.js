var socket = io('http://45.76.25.17');
socket.on('news', function (data) {
    $('#socket-message').html(data.message);
    $('#alert-wrapper').fadeIn(1500).delay(data.delay ? data.delay : 5000).fadeOut(1500);
});
socket.on('viewers', function (viewers) {
    $('#viewer-count').html('| ' + viewers + ' views');
});