var socket = io(location.host);
socket.on('news', function (data) {
    $('#socket-message').html(data.message);
    $('#alert-wrapper').fadeIn(1500).delay(data.delay ? data.delay : 5000).fadeOut(1500);
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