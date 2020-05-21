const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')
const {GroupInfo,Applicant} = require('../../models/groupInfo')
const {Member} = require('../../models/groupMember')
const {GroupInfoValidator} = require('../../validators/validators')
const router = new Router({
    prefix:"/v1/group"
})



router.post('/register', new Auth().m,async (ctx)=>{
    const v =  await new GroupInfoValidator().validate(ctx)
    const  groupInfo = v.get('body')
    let group = await GroupInfo.groupRegister(groupInfo)
    ctx.body = group
})

router.get('/detail',new Auth().m,async (ctx)=>{
    let {groupId} = ctx.request.query
    let groupInfo = await GroupInfo.getGroupInfo(groupId)
    ctx.body = groupInfo
})

router.post('/applicant',new Auth().m,async ctx=>{
    let applicant = ctx.request.body
    await Applicant.handleSubmit(applicant,ctx.auth.uid)
    success("成功递交申请！")
})

router.post('/approveJoin',new Auth().m,async (ctx)=>{
    let memberInfo = ctx.request.body
    await Applicant.approveJoinGroup(memberInfo,ctx.auth.uid)
    success("同意加入")
})

module.exports = router