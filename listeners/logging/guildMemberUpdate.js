const { Listener } = require('gcommands');
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

// Create a new listener listening to the "ready" event
new Listener({
    name: 'Logging - Guild Member Update',
    event: 'guildMemberUpdate',
    run: (old_member, new_member) => {
        const client = new_member.client;
        if(new_member.guild.id != client.configs.id.guild_id) return;

        const em = new MessageEmbed()
            .setColor("#2f3136")
            .setAuthor({ name: `${new_member.user.tag} has been updated`, iconURL: "https://candycz01.xyz/discord/audit/user_update.png" })

        if(old_member.displayName != new_member.displayName) {
            client.modules.base.log(client, {
                embeds: [
                    em.setDescription(`⮩ Old Display Name: ${old_member.displayName}\n⮩ New Display Name: ${new_member.displayName}`)
                ]
            })
        }
        if(!old_member.isCommunicationDisabled() && new_member.isCommunicationDisabled()) {
            client.modules.base.log(client, {
                embeds: [
                    em.setDescription(`⮩ Timeoutted until: <t:${Math.floor(new_member.communicationDisabledUntilTimestamp/1000)}> (for ${ms(new_member.communicationDisabledUntilTimestamp - Date.now(), { long: true })})`)
                ]
            })
        }
        if(old_member.isCommunicationDisabled() && !new_member.isCommunicationDisabled()) {
            client.modules.base.log(client, {
                embeds: [
                    em.setDescription(`⮩ Timeout ${old_member.communicationDisabledUntilTimestamp > +Date.now() ? "cancelled by staff member" : "expired"}`)
                ]
            })
        }
        if(old_member.roles.cache.size != new_member.roles.cache.size) {
            const gave = new_member.roles.cache.filter(r => !old_member.roles.cache.has(r.id));
            const took = old_member.roles.cache.filter(r => !new_member.roles.cache.has(r.id));
            client.modules.base.log(client, {
                embeds: [
                    em.setDescription(`⮩ ${gave.size > 0 ? `Gave role${gave.size > 1 ? "s": ""}` : `Removed role${took.size > 1 ? "s" : ""}`}: ${gave.size > 0 ? gave.map(r => `<@&${r.id}>`).join(", ") : took.map(r => `<@&${r.id}>`).join(", ") }`)
                ]
            });
        }
        if(old_member.user.tag != new_member.user.tag) {
            client.modules.base.log(client, {
                embeds: [
                    em.setDescription(`⮩ Old Name: ${old_member.user.tag}\n⮩ New Name: ${new_member.user.tag}`)
                ]
            })
        }


	}
});