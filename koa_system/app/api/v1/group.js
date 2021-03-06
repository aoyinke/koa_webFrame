const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')
const {GroupInfo,Applicant,GroupCoverImgs} = require('../../models/groupInfo')
const {Member} = require('../../models/groupMember')
const {GroupInfoValidator} = require('../../validators/validators')
const router = new Router({
    prefix:"/v1/group"
})




router.get('/getUserAuth',new Auth().m,async (ctx)=>{
    
    let groupAuth = await GroupInfo.getUserAuth(ctx.auth.uid)
    ctx.body = groupAuth
})

router.post('/register', new Auth().m,async (ctx)=>{
    const v =  await new GroupInfoValidator().validate(ctx)
    const  groupInfo = v.get('body')
    let group = await GroupInfo.groupRegister(groupInfo,ctx.auth.uid)
    ctx.body = group
})


router.post('/updateMemberDepartment', new Auth().m,async (ctx)=>{
    let {members,department} = ctx.request.body
    await Member.updateMemberDepartment(members,department)
})

router.post('/removeFromGroup', new Auth().m,async (ctx)=>{
    let {groupId,uid} = ctx.request.body
    await Member.removeFromGroup(groupId,uid)
})

router.post('/deleteFromDepartment', new Auth().m,async (ctx)=>{
    let memberInfo = ctx.request.body
    await Member.deleteFromDepartment(memberInfo)
})

router.get('/changeGroup',new Auth().m,async (ctx)=>{
    let {name} = ctx.request.query
    let groupInfo = await GroupInfo.getGroupInfoByName(name)
    ctx.body = groupInfo
})

router.get('/detail',new Auth().m,async (ctx)=>{
    let {groupId} = ctx.request.query
    let groupInfo = await GroupInfo.getGroupInfo(groupId,ctx.auth.uid)
    ctx.body = groupInfo
})

router.get('/getUserGroupAuth',new Auth().m,async (ctx)=>{
    let groupInfo = await GroupInfo.getGroupInfo(groupId,ctx.auth.uid)
    ctx.body = groupInfo
})

router.get('/findUserGroup',new Auth().m,async (ctx)=>{
    let info = await GroupInfo.findUserGroup(ctx.auth.uid)
    ctx.body = info
})

router.get('/findOtherGroup',new Auth().m,async (ctx)=>{
    let {uid} = ctx.request.query
    let info = await GroupInfo.findUserGroup(uid)
    ctx.body = info
})

router.get('/findGroupList',new Auth().m,async ctx=>{
    let {college} = ctx.request.query
    let groups = await GroupInfo.findAll({
        where:{
            college:college
        },
        attributes:['logo','id','groupName','description','tags','category'],
        raw:true
    })
    ctx.body = groups
})

router.get('/findGroupColleges',new Auth().m,async ctx=>{
    let colleges = await GroupInfo.findGroupColleges()
    ctx.body = colleges
})

router.post('/changeMemberAuth',new Auth().m,async ctx=>{
    let {auth,department,groupId,id,position} = ctx.request.body
    await Member.changeMemberAuth(groupId,id,auth,department,position)
})

router.get('/groupMembers',new Auth().m,async ctx=>{
    let {groupId} = ctx.request.query
    let members = await Member.findMember(groupId)
    ctx.body = members.splice(0,3)
})

router.get('/getGroupByMember',new Auth().m,async ctx=>{
    let {groupId} = ctx.request.query
    let members = await Member.getGroupByMember(groupId)
    ctx.body = members
})

router.post('/applicant',new Auth().m,async ctx=>{
    let {reason,groupId} = ctx.request.body
    await Applicant.handleSubmit(groupId,reason,ctx.auth.uid)
    success("成功递交申请！")
})

router.get('/getApplicantList',new Auth().m,async ctx=>{
    let {groupId} = ctx.request.query
    let applicants = await Applicant.getApplicantList(groupId)
    ctx.body = applicants
})


router.post('/approveJoin',new Auth().m,async (ctx)=>{
    let memberInfo = ctx.request.body
    await Applicant.approveJoinGroup(memberInfo)
    success("同意加入")
})

router.post('/declineJoin',new Auth().m,async (ctx)=>{
    let memberInfo = ctx.request.body
    await Applicant.declineJoinGroup(memberInfo)
    success("拒绝加入")
})

router.post('/join',new Auth().m,async (ctx)=>{
    let info = ctx.request.body
    await Member.create({
        uid:ctx.auth.uid,
        ...info
    })
    success("创建接口")
})

router.post('/updateMember',new Auth().m,async (ctx)=>{
    let info = ctx.request.body
    await Member.updateMember(info)
    success("创建接口")
})

router.post('/updateGroupInfo',new Auth().m,async (ctx)=>{
    let info = ctx.request.body
    
    await GroupInfo.update({
        ...info
    },
    {
        where:{
            id:info.id
        }
    })
})


router.post('/deleteCoverImg',new Auth().m,async (ctx)=>{
    let {groupId,url} = ctx.request.body
    await GroupCoverImgs.deleteGroupCoverImg(groupId,url)
})
module.exports = router