const util = require('util')
const axios = require('axios')

const {User} = require('../models/user')
const {Auth} = require('../../middlewares/auth')
const { generateToken } = require('../../core/util')

class WXManager {

    static async codeToToken(code){
        const url = util.format(global.config.wx.loginUrl,global.config.wx.appId,global.config.wx.appSecret,code)

        const result = await axios.get(url)

        if(result.status !== 200){
            throw new global.errs.AuthFailed("获取openid失败")
        }

        const errcode = result.data.errcode
        const errmsg = result.data.errmsg
        if(errcode){
            throw new global.errs.AuthFailed("openid获取失败：" + errmsg)
        }

        let user = User.getUserOpenId(result.data.openid)
        if(!user){
            user = await User.registerUserOpenId(result.data.openid)
        }

        return generateToken(user.id,Auth.USER)
    }

    
}


module.exports = {
    WXManager
}