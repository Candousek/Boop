const { Listener } = require('gcommands');
const { MessageEmbed } = require("discord.js");

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Message Delete',
    event: 'messageDelete',
    run: async (msg) => {
        const client = msg.client;
        if(msg.guild.id != client.configs.id.guild_id) return;
        if(msg.partial) return;
        if(msg.author?.bot) return;
        client.modules.base.log(client, {
            embeds: [
                new MessageEmbed()
                    .setColor("#2f3136")
                    .setAuthor({ name: `${msg.author.tag}'s message has been deleted`, iconURL: "https://candycz01.xyz/discord/audit/message_delete.png" })
                    .setDescription(`⮩ Message Content: ${msg.content||"No message content. Maybe Embed."}${msg.content ? `\n\n<#${msg.channel.id}>${msg.attachments.size > 0 ? msg.attachments.map(att => att.url).join(", ") : ""}` : ""}`)
            ]
        })
	}
});