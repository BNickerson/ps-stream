var socket = io(location.host);
var connected = false;

socket.on('viewers', function(viewerCount) {
    $('#viewerCount').html(viewerCount + ' viewers');
});

socket.on('source', function(source) {
    if (connected) {
        console.log('reconnected to stream');
        return;
    }
    console.log(`making initial connection to stream`);
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
    connected = true;
});

socket.on('new-message', function(message) {
    message.content = message.content.replace(/\<(.*?)\>/, '');
    if(!message.content) return;
    $('#chat-window ul').append('<li style="display:none" class="bg-' + message.role + '" data-id="' + message.id + '"><span class="background-' + message.role + '"></span><span class="username ' + message.role + '">' + message.author + ': </span><span class="message"></span></li>');
    $('li[data-id='+ message.id + '] .message').text(message.content);
    $('li[data-id='+ message.id + ']').fadeIn();
    $('#chat-wrapper').animate({scrollTop: $('#chat-window').height()});
    if($('#chat-window ul li').length > 50) {
        $('#chat-window ul li')[0].remove();
    }
});

socket.on('delete-message', function(messageId) {
    $('[data-id="'+ messageId + '"]').remove();
});

socket.on('connected', function() {
    $('#chat-window ul').append('<li class="bg-connected" data-id="connected"><span class="background-powerspike"></span><span class="username powerspike">Steely McBot: </span><span class="message">Welcome to Powerspike.net! You\'ve connected to the chat.</span></li>');
});
