const Router = require('koa-router')

const { Auth } = require('../../../middlewares/auth')
const router = new Router({
    prefix:"/v1/uploadFiles"
})



router.post('/imgs', new Auth().m,async(ctx)=>{
    const file = await ctx.request.files.file
    ctx.body = { path:file}
})


module.exports = router