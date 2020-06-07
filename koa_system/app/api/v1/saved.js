const Router = require('koa-router')
const router = new Router({
    prefix: '/v1/saved'
})
const {Auth} = require('../../../middlewares/auth')

const {Community} = require('../../models/community')

router.get('/UserSavedCommunity',new Auth().m,async ctx=>{
    
    let community = await Community.getUserSavedCommunity(ctx.auth.uid)
    ctx.body = community
})

module.exports = router