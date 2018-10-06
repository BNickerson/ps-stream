const config = require('./private/config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
let io;

const discordHandler = {
    start: (socketServer) => {
        io = socketServer;

        client.on('message', (object) => {
            if (object.channel.id != '494288862114218005' && object.channel.id != '494328607012028425') return;
        
            let supporterRole;
            if(object.member.roles) {
                if (object.member.roles.find(x => x.name == 'Powerspike')) supporterRole = 'powerspike';
                else if (object.member.roles.find(x => x.name == 'Control Crew')) supporterRole = 'moderator';
                else if (object.member.roles.find(x => x.name == 'Diamond Supporter')) supporterRole = 'diamond';
                else if (object.member.roles.find(x => x.name == 'Platinum Supporter')) supporterRole = 'platinum';
                else if (object.member.roles.find(x => x.name == 'Gold Supporter')) supporterRole = 'gold';
                else supporterRole = 'none';
            } else {
                supporterRole = 'none';
            }
            
            let message = {
                author: object.author.username,
                content: object.content,
                id: object.id,
                role: supporterRole
            };
            io.sockets.emit('new-message', message);
        });
        
        client.on('messageDelete', (object) => {
            if (object.channel.id != '494288862114218005' && object.channel.id !=  '494328607012028425') return;
            io.sockets.emit('delete-message', object.id);
        });
        
        client.login(config.discord.token).then(() => {
            console.log('Logged into Discord.');
        });
    }
}

module.exports = discordHandler;