const Router = require('koa-router')
const router = new Router({
    prefix: '/v1/saved'
})
const {Auth} = require('../../../middlewares/auth')

const {Community} = require('../../models/community')
const {UserSavedGroup} = require('../../models/userSaved')
router.get('/UserSavedCommunity',new Auth().m,async ctx=>{
    
    let community = await Community.getUserSavedCommunity(ctx.auth.uid)
    ctx.body = community
})

router.get('/UserSavedGroup',new Auth().m,async ctx=>{
    
    let groupList = await UserSavedGroup.findAll({
        where:{
            uid:ctx.auth.uid
        }
    })
    ctx.body = groupList
})

module.exports = router