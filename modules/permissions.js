module.exports = {
    permissions_check: async function (ctx, permission) {
        if(!ctx.member) return false;
        if(!ctx.member.permissions.has(permission)) {
            await this.send_no_permission_message(ctx);
            return false;
        }
        return true;
    },
    send_no_permission_message: async function (ctx) {
        return await ctx.reply({
            content: `> <:XNo:756467541794226198> Ξ Na tuto akci nemáš dostatečné oprávnění.`,
            ephemeral: true
        })
    }
}