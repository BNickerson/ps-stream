const config = require('./private/config.json');
const Discord = require('discord.js');
const Patreon = require('./models/patreon-model');
const client = new Discord.Client();
let io;

const discordHandler = {
    start: (socketServer) => {
        io = socketServer;

        client.on('ready', async () => {
            const radioChannel = client.channels.find(channel => channel.id == '501885582021099521');
            let connection = await radioChannel.join();
            connection.playStream('https://wowzaprod7-lh.akamaihd.net/i/3035dfef_1@541374/master.m3u8', {seek:0, volume:1});
        });

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

        client.on('guildMemberUpdate', async (oldMember, newMember) => {
            console.log('guildMemberUpdate');
            if(oldMember.roles.has('493973939866042408') || oldMember.roles.has('493973848966823937') || oldMember.roles.has('493973592036474881')) return;

            let patreon;
            if(newMember.roles.has('493973939866042408')) {
                patreon = await new Patreon({
                    displayName:newMember.user.username,
                    patreonLevel:'diamond'
                }).save();
            } else if(newMember.roles.has('493973848966823937')) {
                patreon = await new Patreon({
                    displayName:newMember.user.username,
                    patreonLevel:'platinum'
                }).save();
            } else if(newMember.roles.has('493973592036474881')) {
                patreon = await new Patreon({
                    displayName:newMember.user.username,
                    patreonLevel:'gold'
                }).save();
            }
            if(io) {
                io.sockets.emit('add-patreon', patreon);
            }
        });
        
        client.login(config.discord.token).then(() => {
            console.log('Logged into Discord.');
            client.user.setPresence({ game: { name:'Powerspike.net', type: 'WATCHING' }});
        });
    }
}

module.exports = discordHandler;