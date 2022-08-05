const { Listener } = require('gcommands');
const { MessageEmbed } = require("discord.js");

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Guild Member Remove',
    event: 'guildMemberRemove',
    run: (member) => {
        const client = member.client;
        if(member.guild.id != client.configs.id.guild_id) return;
        client.modules.base.log(client, {
            embeds: [
                new MessageEmbed()
                    .setColor("#2f3136")
                    .setAuthor({ name: `${member.user.tag} has left`, iconURL: "https://candycz01.xyz/discord/audit/user_delete.png" })
            ]
        })
	}
});