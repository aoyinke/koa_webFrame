const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')
const {GroupInfo} = require('../../models/groupInfo')
const {Member} = require('../../models/groupMember')
const {GroupInfoValidator} = require('../../validators/validators')
const router = new Router({
    prefix:"/v1/group"
})



router.post('/register', new Auth().m,async (ctx)=>{
    const v =  await new GroupInfoValidator().validate(ctx)
    const  {groupName,groupType,desctiption,coverImg,logo,category,startTime} = v.get('body')
    await GroupInfo.groupRegister(groupName,groupType,desctiption,coverImg,logo,category,startTime)
    success()
})



router.post('/join',new Auth().m,async (ctx)=>{
    let groupId = ctx.request.body.groupId
    await Member.joinGroup(groupId,ctx.auth.uid)
    success()
})

module.exports = router