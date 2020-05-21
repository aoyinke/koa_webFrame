const Router = require('koa-router')
const router = new Router({
    prefix: '/v1/user'
})
const { RegisterValidator,UpdateUserInfoValidator } = require('../../validators/validators')
const { User } = require('../../models/user')
const {success} = require('../../lib/helper')
const {Auth} = require('../../../middlewares/auth')

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

router.post('/update',new Auth().m,async(ctx)=>{
    const v = await new UpdateUserInfoValidator().validate(ctx)
    const userInfo = v.get('body')
    
    await User.update({
        ...userInfo
    },{
        where:{
            id:ctx.auth.uid
        }
    })
    success("成功修改用户信息~")
    
})

router.get('/getUserInfo',new Auth().m,async(ctx)=>{
    let uesrInfo = await User.getUserInfo(ctx.auth.uid)
    ctx.body=uesrInfo
})
module.exports = router