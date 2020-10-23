const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

const token = config.token;
const prefix = config.prefix;
function errorMessage(channel, error) {
    channel.send(
        new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setDescription("**ERROR**: " + error)
    )
}

client.on('ready', () => {
    console.log('beanbot is online!');
});

client.on('message', (message) => {
    if (message.channel.type != 'text' || message.author.bot) {
        return;
    }

    let messageSend = new Discord.MessageEmbed();
    let clean = message.content.trim();
    if (!clean.startsWith(prefix)) {
        errorMessage(message.channel, "Commands must start with **!**.");
        return;
    }

    let command = clean.split(' ')[0].slice(1);
    let args = message.content.replace(prefix + command, '').trim();
    switch (command) {
        case 'say':
            messageSend.setColor('#0099ff')
            .setDescription(args);
            message.channel.send(messageSend);
            break;
        case 'clear':
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                message.channel.messages.fetch().then((list) => {
                    message.channel.bulkDelete(list);
                }).catch((error) => {
                    errorMessage(message.channel, "Unable to clean channel.");
                });
            }
            break;
        case 'muteall': {
            if (message.member.hasPermission("MUTE_MEMBERS")) {
                let voiceChannel = message.member.voice.channel;
                for (let member of voiceChannel.members) {
                    member[1].voice.setMute(true);
                }
                messageSend.setColor("#0099ff")
                .setDescription("Muted all in **" + voiceChannel.name + "**.");
                message.channel.send(messageSend);
            }
            break;
        }
        default:
            errorMessage(message.channel, "Unknown command **" + command + "**.");
    }

});

client.login(token);