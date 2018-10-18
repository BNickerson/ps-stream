const config = require('./private/config.json');
const Discord = require('discord.js');
const Patreon = require('./models/patreon-model');
//const DiscordUser = require('./models/discordUser-model');
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

        client.on('guildMemberUpdate', async (oldMember, newMember) => {
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
            if(io && patreon) {
                io.sockets.emit('add-patreon', patreon);
            }
        });

        // client.on('messageReactionAdd', async (reaction, user) => {
        //     if ((reaction.emoji.name != 'upvote' && reaction.emoji.name != 'downvote')) return;

        //     if(reaction.emoji.name == 'upvote') {
        //         let existingUser = await DiscordUser.findOne({userId: reaction.message.author.id});
        //         if(existingUser) {
        //             await reaction.message.member.setNickname(`${reaction.message.member.user.username} (${existingUser.upvotes-existingUser.downvotes+1})`);
        //             await DiscordUser.replaceOne({userId: user.id}, {
        //                 userId:reaction.message.author.id,
        //                 upvotes:existingUser.upvotes+1,
        //                 downvotes:existingUser.downvotes
        //             });
        //         } else {
        //             await new DiscordUser({
        //                 userId:reaction.message.author.id,
        //                 upvotes:1,
        //                 downvotes:0
        //             }).save();
        //         }
        //     } else if(reaction.emoji.name == 'downvote') {
        //         let existingUser = await DiscordUser.findOne({userId: reaction.message.author.id});
        //         if(existingUser) {
        //             await reaction.message.member.setNickname(`${reaction.message.member.user.username} (${existingUser.upvotes-existingUser.downvotes-1})`);
        //             await DiscordUser.replaceOne({userId: reaction.message.author.id}, {
        //                 userId:reaction.message.author.id,
        //                 upvotes:existingUser.upvotes,
        //                 downvotes:existingUser.downvotes+1
        //             });
        //         } else {
        //             await new DiscordUser({
        //                 userId:user.id,
        //                 upvotes:0,
        //                 downvotes:1
        //             }).save();
        //         }
        //     }
        // });

        // client.on('messageReactionRemove', async (reaction, user) => {
        //     if ((reaction.emoji.name != 'upvote' && reaction.emoji.name != 'downvote')) return;

        //     if(reaction.emoji.name == 'upvote') {
        //         let existingUser = await DiscordUser.findOne({userId: reaction.message.author.id});
        //         if(existingUser) {
        //             await reaction.message.member.setNickname(`${reaction.message.member.user.username} (${existingUser.upvotes-existingUser.downvotes-1})`);
        //             await DiscordUser.replaceOne({userId: user.id}, {
        //                 userId:reaction.message.author.id,
        //                 upvotes:existingUser.upvotes-1,
        //                 downvotes:existingUser.downvotes
        //             });
        //         } else {
        //             await new DiscordUser({
        //                 userId:reaction.message.author.id,
        //                 upvotes:0,
        //                 downvotes:0
        //             }).save();
        //         }
        //     } else if(reaction.emoji.name == 'downvote') {
        //         let existingUser = await DiscordUser.findOne({userId: reaction.message.author.id});
        //         if(existingUser) {
        //             await reaction.message.member.setNickname(`${reaction.message.member.user.username} (${existingUser.upvotes-existingUser.downvotes+1})`);
        //             await DiscordUser.replaceOne({userId: user.id}, {
        //                 userId:reaction.message.author.id,
        //                 upvotes:existingUser.upvotes,
        //                 downvotes:existingUser.downvotes-1
        //             });
        //         } else {
        //             await new DiscordUser({
        //                 userId:reaction.message.author.id,
        //                 upvotes:0,
        //                 downvotes:0
        //             }).save();
        //         }
        //     }
        // });
        
        client.login(config.discord.token).then(() => {
            console.log('Logged into Discord.');
            client.user.setPresence({ game: { name:'Powerspike.net', type: 'WATCHING' }});
        });
    }
}

module.exports = discordHandler;