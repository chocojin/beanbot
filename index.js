const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

const token = config.token;
const prefix = config.prefix;

client.on('ready', () => {
    console.log('SpoopyBot is online!');
});

client.on('message', (message) => {
    if (message.channel.type != 'text' || message.author.bot) {
        return;
    }

    let clean = message.content.trim();
    if (!clean.startsWith(prefix)) {
        message.channel.send("ERROR: Commands must start with !");
        return;
    }

    let command = clean.split(' ')[0].slice(1);
    let args = message.content.replace('!' + command, '').trim();

    switch (command) {
        case 'say':
            message.channel.send(args);
            break;
        case 'clear':
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                message.channel.messages.fetch().then((list) => {
                    message.channel.bulkDelete(list);
                }).catch((error) => {
                    message.channel.send("ERROR: Error cleaning channel.");
                });
            }
            break;
        case 'muteall': {
            if (message.member.hasPermission("MUTE_MEMBERS")) {
                let voiceChannel = message.member.voice.channel;
                for (let member of voiceChannel.members) {
                    member[1].voice.setMute(true);
                }
            }
            break;
        }
        default:
            message.channel.send("ERROR: Unknown command");
            break;
    }

});

client.login(token);