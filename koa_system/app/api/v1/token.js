const Router = require('koa-router')

const { TokenValidator } = require('../../validators/validators')
const { Auth } = require('../../../middlewares/auth')
const { User } = require('../../models/user')
const { LoginType } = require('../../lib/enum')
const { generateToken } = require('../../../core/util')
const router = new Router({
    prefix: '/v1/user'
})


router.post('/token', async(ctx) => {
    const v = await new TokenValidator().validate(ctx)
    const email = v.get('body.account')
    const plainPassword = v.get('body.secret')
    const type = v.get('body.type')
    let token;
    switch (type) {
        case LoginType.USER_EMAIL:
            token = await emailLogin(email, plainPassword)
            break;
        case LoginType.USER_MINI_PROGRAM:
            break;
        default:
            throw new global.errs.ParameterException('没有相应的处理函数')
    }
    ctx.body = {
        token
    }
})


async function emailLogin(accout, secret) {
    const user = await User.vertifyEmailPassword(accout, secret)
    return token = generateToken(user.id, Auth.USER)
}

module.exports = router