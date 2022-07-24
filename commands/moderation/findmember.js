const { Command, CommandType, ArgumentType } = require('gcommands');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

new Command({
	name: 'findmember',
	description: 'Finds guild member by nickname.',
    permissions: "MANAGE_GUILD",
	type: [ CommandType.SLASH ],
    arguments: [
        {
            name: "nickname",
            description: "The nickname of the members to find.",
            type: ArgumentType.STRING,
            required: true
        }
    ],
	run: (ctx) => {
		
        const query = ctx.arguments.getString("nickname");
        const filtered_members = ctx.guild.members.cache.filter(member => member.user.username.includes(query));

        if (filtered_members.size === 0) {
            return ctx.reply("No members found.");
        };

        fs.writeFileSync(`./data.txt`, `*****************************\n  MEMBER IDS FOR ${query}\n*****************************\n${filtered_members.map(member => member.id).join(",")}\n\n*****************************\n MEMBER IDS WITH NICKNAMES\n*****************************\n${filtered_members.map(member => `${member.id} | ${member.user.tag}`).join("\n")}`);

        ctx.reply({
            content: `Found ${filtered_members.size} member${filtered_members.size > 1 ? "s" : ""}.`,
            files: [ "./data.txt" ]
        })

    }
});