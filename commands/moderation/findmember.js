const { Command, CommandType, ArgumentType } = require('gcommands');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

new Command({
	name: 'findmember',
	description: 'Finds guild member by nickname.',
    defaultMemberPermissions: "MANAGE_GUILD",
	type: [ CommandType.SLASH ],
    arguments: [
        {
            name: "nickname",
            description: "The nickname of the members to find.",
            type: ArgumentType.STRING,
            required: true
        }
    ],
	run: async (ctx) => {

        await ctx.deferReply();
		
        const query = ctx.arguments.getString("nickname");
        const filtered_members = ctx.guild.members.cache.filter(member => member.user.username.toLowerCase().includes(query.toLowerCase()));

        if (filtered_members.size === 0) {
            return ctx.safeReply(`No members found for query ${query}.`);
        };

        fs.writeFileSync(`./data.txt`, `*****************************\n  MEMBER IDS LIST (for massban)\n*****************************\n${filtered_members.map(member => member.id).join(",")}\n\n*****************************\n MEMBER IDS WITH NICKNAMES\n*****************************\n${filtered_members.map(member => `${member.id} | ${member.user.tag}`).join("\n")}`);

        ctx.safeReply({
            content: `Found ${filtered_members.size} member${filtered_members.size > 1 ? "s" : ""} for query ${query}.`,
            files: [ "./data.txt" ]
        })

    }
});