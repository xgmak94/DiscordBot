const Discord = require(`discord.js`);
const ytdl = require(`ytdl-core`);
const {green, red} = require(`../config.json`);
const ytsr = require(`yt-search`);

module.exports = {
    name: 'functions',

    async search(args) { //concatenates the args into 1 search string and returns the results
        var searchString = args.join(` `);
        var search = await ytsr(searchString);
        return search.videos;
    },

    getServer(message, servers) { //adds the current server into our map if needed and returns it
        if(!servers.get(message.guild.id)) {
            var serverInfo = {
                queue: [],
                repeat: false,
            };
            servers.set(message.guild.id, serverInfo);
        }
        var server = servers.get(message.guild.id);
        return server;
    },
    
    nowPlaying(message, server) { //displays the current playing song in server
        var song = server.queue[0];
        var embed = new Discord.MessageEmbed()
                        .setColor(green);

        embed.addFields({
            name: `Now Playing:`,
            value: `[${song.info.videoDetails.title}](${song.url})`
        })

        return message.channel.send(embed).then(msg => {
            msg.delete({timeout: 5000})
        })
    },

	sendMessage(content, channel, color, time = 5000, url = null) { //sends a self deleting message with content
        var embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(content)
                        .setURL(url)

        channel.send(embed).then(msg => {
            msg.delete({ timeout: time});
            return msg;
        });
    },

    async play(connection, message, server, time = 0) {
        var track = await ytdl(server.queue[0].url, 
                        {filter: `audioonly`,
                        quality: 'highestaudio',
                        highWaterMark: 1 << 25});
        server.dispatcher = await connection.play(track, {seek: time});
        setDispatcherListeners(connection, message, server, time);
    },
};

function setDispatcherListeners(connection, message, server, time) {
    server.dispatcher.on('error', () => {
        console.log("Something went wrong with the dispatcher restarting song");
        return module.exports.play(connection, message, server);
    });
    server.dispatcher.on(`finish`, () => {
        if(server.repeat == true) { //repeat the same song
            return module.exports.play(connection, message, server, 0);
        }

        server.queue.shift(); //remove a song
        if(server.queue.length > 0) { //if we still have songs after removing 1, continue
            return module.exports.play(connection, message, server, 0);
        }
        else { //if no songs are left end everything and leave the channel
            server.dispatcher.end();
            message.guild.me.voice.channel.leave();

            return module.exports.sendMessage(`Queue is empty, goodbye!`, message.channel, red, 10000);
        }
    });
    server.dispatcher.on(`start`, () => {
        if(time != 0) return; //display only if we start song from beginning
        module.exports.nowPlaying(message, server);
    });
    server.dispatcher.on(`volumeChange`, (oldVolume, newVolume) => {
        console.log(`Volume changed from ${oldVolume} to ${newVolume}`);
    });
}
