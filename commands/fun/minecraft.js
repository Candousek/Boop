const { Command } = require("gcommands");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

new Command({
    name: "minecraft",
    description: "Minecraft related commands",
    type: [ "SLASH" ],
    arguments: [
        {
            name: "server",
            description: "Shows information about server.",
            type: "SUB_COMMAND",
            arguments: [
                {
                    name: "server",
                    description: "Server IP adress.",
                    type: "STRING",
                    required: true
                }
            ],
        },
        {
            name: "player",
            description: "Shows information about player.",
            type: "SUB_COMMAND",
            arguments: [
                {
                    name: "nickname",
                    description: "Nickname of the player.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "skin",
            description: "Shows player's skin.",
            type: "SUB_COMMAND",
            arguments: [
                {
                    name: "nickname",
                    description: "Nickname of the player.",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    run: async (ctx) => {
        const subCommand = ctx.arguments.getSubcommand();
        
        switch(subCommand) {
            case "server": {
                const server = ctx.arguments.getString("server");
                const url = `https://mcapi.us/server/status?ip=${server}`;
                const server_data = (await axios.get(url)).data;

                if(server_data.status == "error") return ctx.reply(`> <:XNo:756467541794226198> Ξ Server with that IP has not been found. (Is probably offline, or you typed server IP incorrectly.)`);

                const em = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(`> ${server}`)
                    .addFields({ name: "**Players**", value: `${server_data.players.now}/${server_data.players.max}` }, { name: "**Status**", value: server_data.online ? "Online" : "Offline" }, { name: "**Version**", value: server_data.server.name||"???" }, { name: "**MotD**", value: server_data.motd||"???" })

                ctx.reply({ embeds: [ em ]});
                return true;
            }

            case "player": {
                const nickname = ctx.arguments.getString("nickname");
                const url = `https://api.mojang.com/users/profiles/minecraft/${nickname}`;
                const player_data = (await axios.get(url)).data;
                if(!player_data.id) return ctx.reply(`> <:XNo:756467541794226198> Ξ Player with that nickname has not been found.`);
                const name_history = await axios.get(`https://api.mojang.com/user/profiles/${player_data.id}/names`);
                const formatted_name_history = [];
                for(const [key, value] of Object.entries(name_history.data)) {
                    formatted_name_history.push(`${parseInt(key)+1}. ${value.name}${value.changedToAt ? ` (changed at <t:${Math.floor(value.changedToAt/1000)}> » <t:${Math.floor(value.changedToAt/1000)}:R>)` : ""}`);
                }
                const em = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(`> ${nickname}`)
                    .addFields({ name: "**UUID**", value: player_data.id }, { name: "**Name**", value: player_data.name }, { name: "**Name History**", value: formatted_name_history.join("\n") })
                    .setThumbnail(`https://mc-heads.net/combo/${nickname}`)
                ctx.reply({ embeds: [ em ]});
                return true;
            }

            case "skin": {
                const nickname = ctx.arguments.getString("nickname");
                const em = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(`> ${nickname}`)
                    .setImage(`https://mc-heads.net/body/${nickname}`)
                    .setDescription(`◈ **[Download skin](https://mc-heads.net/download/${nickname})**\n◈ **[Set skin](https://mc-heads.net/change/${nickname})**`)
                ctx.reply({ embeds: [ em ]});
                return true;
            }
        }

    }
})