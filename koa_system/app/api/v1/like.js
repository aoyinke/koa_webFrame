const Router = require('koa-router')


const {Auth} = require('../../../middlewares/auth')
const {LikeValidator} = require('../../validators/validators')
const {success} = require('../../lib/helper')

const {Favor,NeedFavor} = require('../../models/favor')
const {GroupFavor} = require('../../models/groupFavor')
const router = new Router({
    prefix:"/v1/like"
})


router.post('/activity',new Auth().m,async(ctx)=>{
    const v = await new LikeValidator().validate(ctx,{
        id:'activity_id'
    })
    let {activity_id,type} = v.get('body')
    await Favor.likeActivity(activity_id,type,ctx.auth.uid)
    success("收藏成功！")
})

router.post('/cancelActivty', new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx,{
        id:'activity_id'
    })
    let {activity_id,type} = v.get('body')
    await Favor.dislikeActivity(activity_id, type, ctx.auth.uid )
    success("已经取消收藏")
})

router.post('/group',new Auth().m,async ctx=>{
    
    let {groupId} = ctx.request.body
    await GroupFavor.likeGroup(groupId,ctx.auth.uid)
    success("收藏该社团成功！")
})

router.post('/cancelSaveGroup',new Auth().m,async ctx=>{

    let {groupId} = ctx.request.body
    await GroupFavor.dislikeGroup(groupId,ctx.auth.uid)
    success("取消收藏该社团成功！")
})

router.post('/likeNeed',new Auth().m,async ctx=>{

    let {needId,category} = ctx.request.body
    await NeedFavor.likeNeed(needId,category,ctx.auth.uid)
    success("支持该需求成功！")
    
})

router.post('/dislikeNeed',new Auth().m,async ctx=>{

    let {needId,category} = ctx.request.body
    await NeedFavor.dislikeNeed(needId,category,ctx.auth.uid)
    success("取消支持该需求成功！")
    
})

router.post('/cancelLikeNeed',new Auth().m,async ctx=>{

    let {needId,category} = ctx.request.body    
})
module.exports = router