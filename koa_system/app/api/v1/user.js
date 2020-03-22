const Router = require('koa-router')
const { request } = require('../../../core/util')
const router = new Router({
    prefix: '/v1/user'
})
const { RegisterValidator } = require('../../validators/validators')
const { User } = require('../../models/user')
const axios = require('axios')
router.post('/register', async(ctx) => {
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        'email': v.get('body.email'),
        'password': v.get('body.password2'),
        'nickname': v.get('body.nickname')
    }
    const r = await User.create(user)
    throw new global.errs.Success()

})

module.exports = router