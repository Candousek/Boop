const { Command, CommandType, ArgumentType } = require('gcommands');
const { MessageAttachment } = require('discord.js');

new Command({
    name: 'tickets',
    description: 'Commands related to ticket system.',
    type: [ CommandType.SLASH ],
    arguments: [
        {
            name: "send",
            type: ArgumentType.SUB_COMMAND,
            description: "Sends a panel to the channel.",
            arguments: [
                {
                    name: "panel",
                    type: ArgumentType.STRING,
                    description: "Panel to send to the channel.",
                    required: true,
                    run: (ctx) => {ctx.respond(Object.keys(ctx.client.configs.tickets).map(t => { return { name: ctx.client.configs.tickets[t].name, value: t }}))}
                }
            ]
        },
        {
            name: "close",
            type: ArgumentType.SUB_COMMAND,
            description: "Closes a ticket.",
        },
        {
            name: "reopen",
            type: ArgumentType.SUB_COMMAND,
            description: "Reopens a ticket.",
        },
        {
            name: "delete",
            type: ArgumentType.SUB_COMMAND,
            description: "Deletes a ticket.",
        },
        {
            name: "claim",
            type: ArgumentType.SUB_COMMAND,
            description: "Claims a ticket.",
        },
        {
            name: "unclaim",
            type: ArgumentType.SUB_COMMAND,
            description: "Unclaims a ticket.",
        },
        {
            name: "transfer",
            type: ArgumentType.SUB_COMMAND,
            description: "Transfers a ticket to another staff member.",
            arguments: [
                {
                    name: "user",
                    type: ArgumentType.USER,
                    description: "Staff member to transfer the ticket to.",
                    required: true
                }
            ]
        },
        {
            name: "add",
            type: ArgumentType.SUB_COMMAND,
            description: "Adds an user to ticket.",
            arguments: [
                {
                    name: "user",
                    type: ArgumentType.USER,
                    description: "User to add to the ticket.",
                    required: true
                }
            ]
        },
        {
            name: "remove",
            type: ArgumentType.SUB_COMMAND,
            description: "Removes an user from ticket.",
            arguments: [
                {
                    name: "user",
                    type: ArgumentType.USER,
                    description: "User to remove from the ticket.",
                    required: true
                }
            ]
        }
    ],
    run: async (ctx) => {

        const subCmd = ctx.arguments.getSubcommand();
        const { member } = ctx;

        switch(subCmd) {
            case "send": {
                if(!await ctx.client.modules.permissions.permissions_check(ctx, "MANAGE_GUILD")) return;
                const panel = ctx.arguments.getString("panel");

                await ctx.deferReply();
                await ctx.deleteReply();
                ctx.channel.send(ctx.client.configs.tickets[panel].messages.click_to_create);
                return true;
            }
            case "close": {
                const closed = await ctx.client.modules.tickets.close(ctx.client, ctx.channel.id, member.id);
                if(closed.success) {
                    await ctx.deferReply();
                    await ctx.deleteReply();
                } else {
                    await ctx.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not close ticket.\n\`\`\`> ${closed.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "reopen": {
                if(!await ctx.client.modules.permissions.permissions_check(ctx, "KICK_MEMBERS")) return;
                const reopened = await ctx.client.modules.tickets.open(ctx.client, ctx.channel.id, member.id);
                if(reopened.success) {
                    await ctx.deferReply();
                    await ctx.deleteReply();
                } else {
                    await ctx.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not reopen ticket.\n\`\`\`> ${reopened.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "delete": {
                if(!await ctx.client.modules.permissions.permissions_check(ctx, "MANAGE_GUILD")) return;
                const deleted = await ctx.client.modules.tickets.delete(ctx.client, ctx.channel.id, member.id);
                if(deleted.success) {
                    await ctx.deferReply();
                    await ctx.deleteReply();
                } else {
                    await ctx.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not delete ticket.\n\`\`\`> ${deleted.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "claim": {
                if(!await ctx.client.modules.permissions.permissions_check(ctx, "KICK_MEMBERS")) return;
                const claimed = await ctx.client.modules.tickets.claim(ctx.client, ctx.channel.id, member.id);
                if(claimed.success) {
                    await ctx.deferReply();
                    await ctx.deleteReply();
                } else {
                    await ctx.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not claim ticket.\n\`\`\`> ${claimed.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "transfer": {
                if(!await ctx.client.modules.permissions.permissions_check(ctx, "MANAGE_GUILD")) return;
                await ctx.client.modules.tickets.unclaim(ctx.channel.id);
                const claimed = await ctx.client.modules.tickets.claim(ctx.client, ctx.channel.id, ctx.arguments.getUser("user").id);
                if(claimed.success) {
                    await ctx.deferReply();
                    await ctx.deleteReply();
                } else {
                    await ctx.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not transfer ticket.\n\`\`\`> ${claimed.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "add": {
                if(!await ctx.client.modules.permissions.permissions_check(ctx, "MANAGE_GUILD")) return;
                const added = await ctx.client.modules.tickets.users.add(ctx.client, ctx.arguments.getUser("user").id, ctx.channel.id);
                if(added.success) {
                    await ctx.deferReply({ ephemeral: true });
                    await ctx.editReply(`> <:XYes:756467541794226198> Ξ Added user to ticket.`);
                } else {
                    await ctx.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not add user to ticket.\n\`\`\`> ${added.message} <\`\`\``,
                        ephemeral: true,
                    });
                }
                return true;
            }
            case "remove": {
                    if(!await ctx.client.modules.permissions.permissions_check(ctx, "MANAGE_GUILD")) return;
                const removed = await ctx.client.modules.tickets.users.remove(ctx.client, ctx.arguments.getUser("user").id, ctx.channel.id);
                if(removed.success) {
                    await ctx.deferReply({ ephemeral: true });
                    await ctx.editReply(`> <:XYes:756467541794226198> Ξ User removed from the ticket.`);
                } else {
                    await ctx.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not remove user from ticket.\n\`\`\`> ${removed.message} <\`\`\``,
                        ephemeral: true,
                    });
                }
                return true;
            }
        }
    }
});