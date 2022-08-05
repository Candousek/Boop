const { Listener } = require("gcommands");

new Listener({
    name: "tickets",
    event: "interactionCreate",
    run: async (interaction) => {

        const { customId, client, member, channelId } = interaction;
        if(!customId) return;

        if(customId.includes("tickets-actions-create-")) {
            await interaction.deferReply({ ephemeral: true });
            const ticket_panel = customId.split("-")[3];
            const ticket_category = interaction.values[0]?.split("-")[3]||customId.split("-")[4];
            const channel = await client.modules.tickets.create(ticket_panel, ticket_category, client, member.id);
            await interaction.editReply(client.modules.base.replaceInObject(client.configs.tickets[ticket_panel].categories[ticket_category]?.messages?.created_info||client.configs.tickets[ticket_panel].messages.created_info, {"{channel}": `<#${channel.id}>`}));
        }

        switch(customId) {
            case "tickets-actions-close": {
                const closed = await client.modules.tickets.close(client, channelId, member.id);
                if(closed.success) {
                    await interaction.deferReply();
                    await interaction.deleteReply();
                } else {
                    await interaction.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not close ticket.\n\`\`\`> ${closed.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "tickets-actions-reopen": {
                const reopened = await client.modules.tickets.open(client, channelId, member.id);
                if(reopened.success) {
                    await interaction.deferReply();
                    await interaction.deleteReply();
                } else {
                    await interaction.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not reopen ticket.\n\`\`\`> ${reopened.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "tickets-actions-delete": {
                const deleted = await client.modules.tickets.delete(client, channelId, member.id);
                if(!deleted.success) {
                    await interaction.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not delete ticket.\n\`\`\`> ${deleted.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
            case "tickets-actions-claim": {
                const claimed = await client.modules.tickets.claim(client, channelId, member.id);
                if(claimed.success) {
                    await interaction.deferReply();
                    await interaction.deleteReply();
                } else {
                    await interaction.reply({
                        content: `> <:XNo:756467541794226198> Ξ Could not claim ticket.\n\`\`\`> ${claimed.message} <\`\`\``,
                        ephemeral: true,
                    })
                }
                return true;
            }
        }

    }
});

new Listener({
    name: "Ticket - Delete Channel",
    event: "channelDelete",
    run: async (channel) => {

        const { client } = channel;

        const ticket_db_object = (await client.modules.db.query(`SELECT * FROM tickets WHERE channel_id = ?`, [channel.id]))[0];

        if(ticket_db_object) {
            await client.modules.tickets.delete(client, channel.id);
        };
    }
})