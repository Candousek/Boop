const { Listener } = require('gcommands');
const { MessageEmbed } = require("discord.js");

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Guild Member Add',
    event: 'guildMemberAdd',
    run: (member) => {
        const client = member.client;
        if(member.guild.id != client.configs.id.guild_id) return;
        client.modules.base.log(client, {
            embeds: [
                new MessageEmbed()
                    .setColor("#2f3136")
                    .setAuthor({ name: `${member.user.tag} has joined`, iconURL: "https://candycz01.xyz/discord/audit/user_add.png" })
                    .setDescription(`⮩ Account created at: <t:${Math.floor(member.user.createdTimestamp/1000)}>`)
            ]
        })
	}
});