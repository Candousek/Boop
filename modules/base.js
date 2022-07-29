const { WebhookClient } = require("discord.js");

module.exports = {
    log: async function(client, text) {
        const webhook_client = new WebhookClient({ url: client.configs.id.logs_webhook_url });

        webhook_client.send({
            content: text,
            username: client.user.username,
            avatarURL: client.user.displayAvatarURL()
        })
    }
}