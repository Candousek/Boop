const Discord = require("discord.js");

async function createChannel(voice_state) {
    const { client } = voice_state;
    const channel = await client.guilds.cache.get(client.configs.id.guild_id).channels.create(`${voice_state.member.user.username.replace(/[\u{0080}-\u{10FFFF}]/gu,"")}'s channel`, {
        type: 'GUILD_VOICE',
        parent: client.channels.cache.get(client.configs.id.auto_channel.category),
    });
    return channel;
};

async function join(voice_state) {
    const { client } = voice_state;
    if(!client.configs.id.auto_channel.create_channels.includes(voice_state.channelId)) return false;
    const channel = await createChannel(voice_state, client);
    await client.modules.db.query(`INSERT INTO voice_channels (channel_id, user_id, owner_id, name) VALUES (?, ?, ?, ?)`, [ channel.id, voice_state.member.id, voice_state.member.id, channel.name ]);
    await voice_state.member.voice.setChannel(channel);
};

async function leave(voice_state) {
    const client = voice_state.client;
    const channel = voice_state.channel;
    const channel_from_database = (await client.modules.db.query(`SELECT * FROM voice_channels WHERE channel_id=?`, [ voice_state.channelId ]))[0];
    if(!channel_from_database) return false;
    if(channel.members.size == 0) {
        await client.modules.db.query(`DELETE FROM voice_channels WHERE channel_id=?`, [ channel.id ]);
        return await voice_state.channel.delete();
    }
    if(channel_from_database.owner_id != voice_state.member.id) return;
    const next_owner = voice_state.channel.members.first();
    await client.modules.db.query(`UPDATE voice_channels SET owner_id=? WHERE channel_id=?`, [ next_owner.id, channel.id ]);
}

module.exports = {
    join, leave
}