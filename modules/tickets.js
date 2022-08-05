const { MessageEmbed } = require("discord.js");
const db = require("./db");

const getPermissionOverwrites = async (channel) => {
    const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id = ?`, [channel.id]))[0];
    let added_users = await db.query(`SELECT * FROM ticket_users WHERE channel_id = ?`, [channel.id]);
    if(!ticket) return;
    added_users = added_users.filter(user_db_object => channel.guild.members.cache.has(user_db_object.user_id));
    return added_users.map(user_db_object => {
        return {
            id: user_db_object.user_id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"],
    }
    })

}

module.exports = {
    create: async function(ticket_panel, ticket_category, client, owner_id, send_message=true) {
        const config = client.configs.tickets;
        const category = client.channels.cache.get(config[ticket_panel][ticket_category]?.category_id||config[ticket_panel].category_id);
        const guild = category.guild;
        const all_tickets = await db.query(`SELECT * FROM tickets`);
        const all_deleted_tickets = await db.query(`SELECT * FROM ticket_logs`);
        const ticket_id = all_tickets.length + all_deleted_tickets.length + 1;
        const ticket_name = `${(config[ticket_panel].categories[ticket_category]?.channel_format||config[ticket_panel].channel_format).replaceAll("{id}", ticket_id)}`;
        const channel = await guild.channels.create(ticket_name, {
            parent: category,
            permissionOverwrites: [
                {
                    id: owner_id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "READ_MESSAGE_HISTORY"],
                }
            ]
        });
        await db.query(`INSERT INTO tickets (ticket_id, channel_id, owner_id, panel, category) VALUES (?, ?, ?, ?, ?)`, [ticket_id, channel.id, owner_id, ticket_panel, ticket_category])
        await this.log(client, "create", channel.id);
        await this.users.add(owner_id, channel.id);
        if(send_message) await channel.send(client.modules.base.replaceInObject(config[ticket_panel].categories[ticket_category]?.messages?.created||config[ticket_panel].messages.created||{content: "Ticket created."}, { "{usermention}": `<@${owner_id}>` }));
        return channel;
    },

    close: async function(client, channel_id, admin_id="522048274689949712", send_message=true) {
        const config = client.configs.tickets;
        const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id = ?`, [channel_id]))[0];
        if(!ticket) return { success: false, message: "ticket not found in system" };
        if(ticket.is_closed) return { success: false, message: "ticket is already closed" };
        const { ticket_id, category, panel } = ticket;
        await db.query(`UPDATE tickets SET is_closed=1 WHERE channel_id=?`, [channel_id]);
        const channel = client.channels.cache.get(channel_id);
        if(send_message) await channel.send(client.modules.base.replaceInObject(config[panel]?.categories[category]?.messages?.closed||config[panel]?.messages?.closed||{content: "Ticket closed."}, { "{usermention}": `<@${admin_id}>` }));
        await channel.lockPermissions();
        await channel.edit({
            parent: client.configs.tickets[panel].categories[category].closed_category_id||client.configs.tickets[panel].closed_category_id||channel.parent,
        });
        await this.log(client, "close", channel_id, admin_id);
        return {
            success: true,
            message: "ticket closed",
            channel
        };
    },

    open: async function(client, channel_id, admin_id="522048274689949712", send_message=true) {
        const config = client.configs.tickets;
        const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id = ?`, [channel_id]))[0];
        if(!ticket) return { success: false, message: "ticket not found in system" };
        if(!ticket.is_closed) return { success: false, message: "ticket is already opened" };
        const { ticket_id, category, panel } = ticket;
        await db.query(`UPDATE tickets SET is_closed=0 WHERE channel_id=?`, [channel_id]);
        const channel = client.channels.cache.get(channel_id);
        if(send_message) await channel.send(client.modules.base.replaceInObject(config[panel].categories[category]?.messages?.reopen||config[panel]?.messages?.reopen||{content: "Ticket opened."}, { "{usermention}": `<@${admin_id}>` }));
        await channel.lockPermissions();
        await channel.edit({
            parent: client.configs.tickets[panel].categories[category].category_id||client.configs.tickets[panel].category_id||channel.parent,
            permissionOverwrites: await getPermissionOverwrites(channel)
        });
        await this.log(client, "open", channel_id, admin_id);
        return {
            success: true,
            message: "ticket opened",
            channel
        };
    },

    delete: async function(client, channel_id) {
        const config = client.configs.tickets;
        const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id = ?`, [channel_id]))[0];
        if(!ticket) return { success: false, message: "ticket not found in system" };
        const { ticket_id, category, panel } = ticket;
        const channel = client.channels.cache.get(channel_id);
        if(channel) await this.transcript(channel);
        await this.log(client, "delete", channel_id);
        await db.query(`DELETE FROM tickets WHERE channel_id=?`, [channel_id]);
        if(channel) await channel.delete();
        return {
            success: true,
            message: "ticket deleted",
            channel,
            ticket
        };
    },

    claim: async function(client, channel_id, user_id) {
        const config = client.configs.tickets;
        const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id = ?`, [channel_id]))[0];
        if(!ticket) return { success: false, message: "ticket not found in system" };
        if(ticket.is_claimed) return { success: false, message: "ticket is already claimed" };
        const { ticket_id, category, panel } = ticket;
        await db.query(`UPDATE tickets SET is_claimed=1, claimed_by=? WHERE channel_id=?`, [user_id, channel_id]);
        const channel = client.channels.cache.get(channel_id);
        await channel.send(client.modules.base.replaceInObject(config[panel].categories[category]?.messages?.claim||config[panel]?.messages?.claim||{content: "Ticket claimed."}, { "{usermention}": `<@${user_id}>` }));
        await this.log(client, "claim", channel_id, user_id);
        return {
            success: true,
            message: "ticket claimed",
            channel
        };
    },

    unclaim: async function(channel_id) {
        const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id = ?`, [channel_id]))[0];
        if(!ticket) return { success: false, message: "ticket not found in system" };
        if(!ticket.is_claimed) return { success: false, message: "ticket is already unclaimed" };
        await db.query(`UPDATE tickets SET is_claimed=0, claimed_by=NULL WHERE channel_id=?`, [channel_id]);
        return {
            success: true,
            message: "ticket unclaimed"
        };
    },

    transcript: async function(channel) {

        let before;

        const arrayOfMessageMaps = [];
        
        const maxLoads = 5;
        let currentlyAt = 0;
        while(currentlyAt < maxLoads) {
            currentlyAt++;

            const tempMessages = await channel.messages.fetch({ limit: 100 , before });
            if(tempMessages.length > 99) before = Array.from(tempMessages)[tempMessages.length-1][0];
            arrayOfMessageMaps.push(tempMessages);
            if(tempMessages.length < 100) break;
        }

        const messages = [];

        arrayOfMessageMaps.forEach(messageMap => {
            messageMap.map(msg => {
                messages.push(msg)
            })
        })

        const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id=?`, [ channel.id ]))[0];
        if(!ticket) return false;

        await db.query(`INSERT INTO ticket_logs (ticket_id, channel_id, ticket_log) VALUES (?, ?, ?)`, [ ticket.ticket_id, ticket.channel_id, JSON.stringify(messages) ]);

        return true;
    },

    users: {
        add: async function(client, user_id, channel_id) {
            const user_in_ticket = (await db.query(`SELECT * FROM ticket_users WHERE user_id=? AND channel_id=?`, [user_id, channel_id]))[0];
            if(user_in_ticket) return { success: false, message: "user is already in ticket" };
            await db.query(`INSERT INTO ticket_users (user_id, channel_id) VALUES (?, ?)`, [user_id, channel_id]);
            const channel = client.channels.cache.get(channel_id);
            await channel.edit({
                permissionOverwrites: await getPermissionOverwrites(channel)
            })
            return { success: true, message: "user added to ticket" };
        },
        remove: async function(client, user_id, channel_id) {
            const user_in_ticket = (await db.query(`SELECT * FROM ticket_users WHERE user_id=? AND channel_id=?`, [user_id, channel_id]))[0];
            if(!user_in_ticket) return { success: false, message: "user is not in ticket" };
            await db.query(`DELETE FROM ticket_users WHERE user_id=? AND channel_id=?`, [user_id, channel_id]);
            const channel = client.channels.cache.get(channel_id);
            await channel.edit({
                permissionOverwrites: await getPermissionOverwrites(channel)
            })
            return { success: true, message: "user removed from ticket" };
        }
    },

    log: async function(client, type, channel_id, message=null) {
        const config = client.configs.tickets;
        const ticket = (await db.query(`SELECT * FROM tickets WHERE channel_id=?`, [channel_id]))[0];
        if(!ticket) return { success: false, message: "ticket not found in system" };
        const { ticket_id, category, panel, owner_id, added_users, claimed_by, is_claimed, is_closed } = ticket;
        const log_channel = client.channels.cache.get(config[panel]?.categories[category]?.logs?.channel_id||config[panel].logs.channel_id);
        const enabled_config = config[panel]?.categories[category]?.logs?.types||config[panel].logs.types;
        
        switch(type) {
            case "create": {
                if(!enabled_config.create) return;
                const em = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Ticket Created")
                    .addFields({ name: "Ticket ID", value: ticket_id }, { name: "Category", value: category }, { name: "Panel", value: panel }, { name: "Channel", value: `<#${channel_id}>` }, { name: "Owner", value: `<@${ticket.owner_id}> | ${ticket.owner_id}` })
                    .setFooter({ text: `${client.user.username} | Ticket created`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();
                await log_channel.send({ embeds: [ em ] });
                return true;
            }
            case "user_add": {
                if(!enabled_config.user_add) return;
                const em = new MessageEmbed()
                    .setColor("DARK_AQUA")
                    .setTitle("User Added to Ticket")
                    .addFields({ name: "Ticket ID", value: ticket_id }, { name: "Channel", value: `<#${channel_id}>` }, { name: "Owner", value: `<@${owner_id}> | ${owner_id}` }, { name: "User", value: `<@${message}> | ${message}` })
                    .setFooter({ text: `${client.user.username} | User added to ticket`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();
                await log_channel.send({ embeds: [ em ] });
                return true;
            }
            case "close": {
                if(!enabled_config.close) return;
                const em = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Ticket Closed")
                    .addFields({ name: "Ticket ID", value: ticket_id }, { name: "Channel", value: `<#${channel_id}>` }, { name: "Owner", value: `<@${owner_id}> | ${owner_id}` }, { name: "Closed By", value: `<@${message}> | ${message}` })
                    .setFooter({ text: `${client.user.username} | Ticket closed`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();
                await log_channel.send({ embeds: [ em ] });
                return true;
            }
            case "claim": {
                if(!enabled_config.claim) return;
                const em = new MessageEmbed()
                    .setColor("GREYPLE")
                    .setTitle("Ticket Claimed")
                    .addFields({ name: "Ticket ID", value: ticket_id }, { name: "Channel", value: `<#${channel_id}>` }, { name: "Owner", value: `<@${owner_id}> | ${owner_id}` }, { name: "Claimed By", value: `<@${message}> | ${message}` })
                    .setFooter({ text: `${client.user.username} | Ticket claimed`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();
                await log_channel.send({ embeds: [ em ] });
                return true;
            }
            case "unclaim": {
                if(!enabled_config.unclaim) return;
                const em = new MessageEmbed()
                    .setColor("DARK_PURPLE")
                    .setTitle("Ticket Unclaimed")
                    .addFields({ name: "Ticket ID", value: ticket_id }, { name: "Channel", value: `<#${channel_id}>` }, { name: "Owner", value: `<@${owner_id}> | ${owner_id}` }, { name: "Unclaimed By", value: `<@${message}> | ${message}` })
                    .setFooter({ text: `${client.user.username} | Ticket unclaimed`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();
                await log_channel.send({ embeds: [ em ] });
                return true;
            }
            case "delete": {
                if(!enabled_config.delete) return;
                const em = new MessageEmbed()
                    .setColor("DARK_RED")
                    .setTitle("Ticket Deleted")
                    .addFields({ name: "Ticket ID", value: ticket_id }, { name: "Channel", value: `<#${channel_id}>` }, { name: "Owner", value: `<@${owner_id}> | ${owner_id}` }, { name: "Deleted By", value: `${message ? `<@${message}> | ${message}` : "Unknown"}` })
                    .setFooter({ text: `${client.user.username} | Ticket deleted`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();
                await log_channel.send({ embeds: [ em ] });
                return true;
            }
            case "reopen": {
                if(!enabled_config.reopen) return;
                const em = new MessageEmbed()
                    .setColor("DARK_BLUE")
                    .setTitle("Ticket Reopened")
                    .addFields({ name: "Ticket ID", value: ticket_id }, { name: "Channel", value: `<#${channel_id}>` }, { name: "Owner", value: `<@${owner_id}> | ${owner_id}` }, { name: "Reopened By", value: `<@${message}> | ${message}` })
                    .setFooter({ text: `${client.user.username} | Ticket reopened`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();
                await log_channel.send({ embeds: [ em ] });
                return true;
            }
        }

    }
}