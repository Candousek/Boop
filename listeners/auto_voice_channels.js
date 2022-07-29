const { Listener } = require("gcommands");

new Listener({
    name: "Auto Voice Channel",
    event: "voiceStateUpdate",
    run: async (old_state, new_state) => {

        const client = new_state.client;

        if(new_state.channelId) client.modules.auto_voice_channels.join(new_state);
        if(old_state.channelId) client.modules.auto_voice_channels.leave(old_state);


    },
});
