const { WebhookClient } = require("discord.js");

module.exports = {
    log: async function(client, options) {
        const webhook_client = new WebhookClient({ url: client.configs.id.logs_webhook_url });

        options.username = client.user.username
        options.avatarURL = client.user.displayAvatarURL()

        webhook_client.send(options)
    },

    replaceInObject: function(object, replaceInfo) {
        let stringified = JSON.stringify(object);
        for(const [key, value] of Object.entries(replaceInfo)) {
            stringified = stringified.replaceAll(key, value);
        }
            
        return JSON.parse(stringified);
    }
}