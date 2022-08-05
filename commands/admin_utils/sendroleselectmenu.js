const { Command, CommandType, ArgumentType } = require('gcommands');
const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

new Command({
	name: 'sendroleselectmenu',
	description: 'Sends role select menu.',
    defaultMemberPermissions: "MANAGE_GUILD",
	type: [ CommandType.SLASH ],
	run: async (ctx) => {

        const config = ctx.client.configs.reaction_roles;

        await ctx.deferReply();

        for(const [groupName, groupConfig] of Object.entries(config)) {
            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`role-select-menu-${groupName}`)
                    .setMinValues(groupConfig.type == "single" ? 1 : 0)
                    .setMaxValues(groupConfig.type == "single" ? 1 : groupConfig.roles.length)
                    .setPlaceholder(`Click to select roles.`)
                    .addOptions(groupConfig.roles.map(r => { return { label: r.name, value: r.id, description: r.description, emoji: r.icon }}))
            );

            await ctx.channel.send({
                content: `>>> ${groupConfig.icon}・__**${groupConfig.name}**__\n\n${groupConfig.description}`,
                components: [ row ]
            });
        }

        await ctx.deleteReply();

    }
});