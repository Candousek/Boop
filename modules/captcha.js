const axios = require("axios");

module.exports = {
    get: async function() {
        const res = (await axios.get(`https://captcha-api.akshit.me/v2/generate?height=90&width=300&circles=150&length=7`)).data;
        return res;
    },
    verify: async function(uuid, captcha) {
        return axios.post(`https://captcha-api.akshit.me/v2/verify`, {
            uuid, captcha
        })
            .then(res => true)
            .catch(err => false);
    }
}