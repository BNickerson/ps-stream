var socket = io('http://45.76.25.17');
socket.on('news', function (data) {
    $('#socket-message').html(data.message);
    $('#alert-wrapper').fadeIn(1500).delay(data.delay ? data.delay : 5000).fadeOut(1500);
});
socket.on('viewers', function (viewers) {
    $('#viewer-count').html('| ' + viewers + ' views');
});
socket.on('discord-connected', function () {
    var html = '<div class="message"><span class="text">Steely McBeam has connected to Discord!</span></div>';
    $('#discord-chat').append(html);
});
socket.on('message', function (message) {
    console.log(message);
    var html = '<div class="message"><span><img src="'+ message.user.avatar + '" /></span><span class="user" style="color:' + message.user.color + '">' + message.user.username + '</span><span class="text">: ' + message.content + '</span></div>';
    $('#discord-chat').append(html);
    $('#discord-chat').scrollTop($('#discord.chat').height());
});