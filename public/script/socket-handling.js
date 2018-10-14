var socket = io(location.host);
var connected = false;
var displayConnected = true;

socket.on('viewers', function(viewerCount) {
    $('#viewerCount').html(viewerCount + ' viewers');
});

socket.on('source', function(source) {
    if (connected) {
        console.log('reconnected to stream');
        return;
    }
    console.log(`making initial connection to stream`);
    console.log(source);
    WowzaPlayer.create('playerElement',
        {
            "license":"PLAY1-accfh-NkaWE-Vbkp6-9vGaG-YVCxm",
            "title":"",
            "description":"",
            "sourceURL":source,
            "autoPlay":false,
            "volume":"75",
            "mute":false,
            "loop":false,
            "audioOnly":false,
            "uiShowQuickRewind":true,
            "uiQuickRewindSeconds":"30",
            "debugLevel": "OFF"
        }
    );
    connected = true;
});

socket.on('new-message', function(message) {
    message.content = message.content.replace(/\<(.*?)\>/g, '');
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
    if (displayConnected) {
        $('#chat-window ul').append('<li class="bg-connected" data-id="connected"><span class="background-powerspike"></span><span class="username powerspike">Steely McBot: </span><span class="message">Welcome to Powerspike.net! You\'ve connected to the chat.</span></li>');
        displayConnected = false;
    }
});

socket.on('no-streams', function() {
    alert('No streams are registered on the website yet. Try refreshing the page.');
});

socket.on('donation', function(data) {
    updateDonation(data.now, data.total);
});

socket.on('add-patreons', function(patreons) {
    $.each(patreons, function (index, patreon) {
        addPatreon(patreon);
    });
});

socket.on('add-patreon', function(patreon) {
    addPatreon(patreon);
});

var updateDonation = function(now, total) {
    var percentage = now/total*100 > 100 ? 100 : now/total*100;
    $('#goalProgress').removeClass();
    $('#goalProgress').addClass('progress-bar progress-bar-striped progress-bar-big');
    if (percentage < 25) {
        $('#goalProgress').addClass('bg-danger');
    } else if (percentage >= 25 && percentage < 50) {
        $('#goalProgress').addClass('bg-warning');
    } else if (percentage >= 50 && percentage < 75) {
        $('#goalProgress').addClass('bg-info');
    } else if (percentage >= 75 && percentage < 100) {
        $('#goalProgress').addClass('bg-success');
    } else {
        $('#goalProgress').addClass('bg-gold active');
    }
    console.log(percentage);
    $('#goalTag').html('$' + now + '/$' + total);
    $('#goalProgress').css('width', percentage + '%');
}

var addPatreon = function(patreon) {
    let html = '<div data-id="' + patreon._id + '" style="display:none;" class="badge badge-pill badge-' + patreon.patreonLevel + '">' + patreon.displayName + '</div>';
    $('#patreonList').append(html);
    $('[data-id=' + patreon._id + ']').fadeIn();
}

$(document).ready(function() {
    socket.emit('getDonation');
    socket.emit('getPatreons');
});