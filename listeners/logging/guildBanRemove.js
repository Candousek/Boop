const { Listener } = require('gcommands');
const { MessageEmbed } = require("discord.js");

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Guild Ban Removed',
    event: 'guildBanRemove',
    run: (ban) => {
        const client = ban.client;
        if(ban.guild.id != client.configs.id.guild_id) return;
        client.modules.base.log(client, {
            embeds: [
                new MessageEmbed()
                    .setColor("#2f3136")
                    .setAuthor({ name: `${ban.user.tag} has been unbanned`, iconURL: "https://candycz01.xyz/discord/audit/user_add.png" })
                    .setDescription(`⮩ Reason: ${ban.reason||"None"}`)
            ]
        })
	}
});