var socket = io(location.host);
socket.on('news', function (data) {
    $('#socket-message').html(data.message);
    $('#alert-wrapper').fadeIn(1500).delay(data.delay ? data.delay : 5000).fadeOut(1500);
});

socket.on('viewers', function(viewerCount) {
    $('#viewerCount').html(viewerCount + ' viewers');
});

socket.on('source', function(source) {
    console.log(`connecting to ${source}`);
    WowzaPlayer.create('playerElement',
        {
            "license":"PLAY1-3cMvd-Mf3tG-dBcHp-6zKn8-X9cTm",
            "title":"",
            "description":"",
            "sourceURL":source,
            "autoPlay":false,
            "volume":"75",
            "mute":false,
            "loop":false,
            "audioOnly":false,
            "uiShowQuickRewind":true,
            "uiQuickRewindSeconds":"30"
        }
    );
});

socket.on('new-message', function(message) {
    message.content = message.content.replace(/\<(.*?)\>/, '');
    if(!message.content) return;
    $('#chat-window ul').append('<li class="bg-' + message.role + '" data-id="' + message.id + '"><span class="background-' + message.role + '"></span><span class="username ' + message.role + '">' + message.author + ': </span><span class="message"></span></li>');
    $('li[data-id='+ message.id + '] .message').text(message.content);
    $('#chat-wrapper').animate({scrollTop: $('#chat-window').height()});
    if($('#chat-window ul li').length > 50) {
        $('#chat-window ul li')[0].remove();
    }
});

socket.on('delete-message', function(messageId) {
    $('[data-id="'+ messageId + '"]').remove();
});
