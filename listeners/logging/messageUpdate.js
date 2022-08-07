const { Listener } = require('gcommands');
const { MessageEmbed } = require("discord.js");

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Message Update',
    event: 'messageUpdate',
    run: async (old_message, new_message) => {
        const client = new_message.client;
        if(new_message.guild.id != client.configs.id.guild_id) return;
        if(new_message.author?.bot) return;
        if(new_message.content == old_message.content) return;
        client.modules.base.log(client, {
            embeds: [
                new MessageEmbed()
                    .setColor("#2f3136")
                    .setAuthor({ name: `${new_message.author.tag}'s message has been edited`, iconURL: "https://candycz01.xyz/discord/audit/message_delete.png" })
                    .setDescription(`⮩ Old Message Content: ${old_message.content||"No message content. Maybe not cached"}\n⮩ New Message Content: ${new_message.content||"No message content. Maybe Embed."}${new_message.content ? `\n\n<#${new_message.channel.id}> | [Jump to message](${new_message.url})` : ""}`)
            ]
        })
	}
});