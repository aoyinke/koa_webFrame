const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')

const {ActivityValidator,AddCommentValidator} = require('@validator')

const {Community} = require('../../models/community')
const {Comment} = require('../../models/comment')
const router = new Router({
    prefix:"/v1/ActivityInfo"
})


router.get('/:list/getComment', async (ctx)=>{
    
})

router.post('/addComment', new Auth().m, async (ctx)=>{
    const v = await new AddCommentValidator().validate(ctx,{
        id:"activity_id"
    })
    let commentInfo = v.get('body')
    await Comment.addActivityComment(commentInfo,ctx.auth.uid)
    success("成功添加了评论~")

})

router.get('/getActivity', async(ctx)=>{
    let {currentPage} = ctx.request.query
    let res = await Community.findActivity(currentPage)
    ctx.body = res
})

router.get('/getDynamic', async(ctx)=>{
    let {currentPage} = ctx.request.query
    let res = await Community.findDynamic(currentPage)
    ctx.body = res
})

router.get('/getAnswer', async(ctx)=>{
    let {currentPage} = ctx.request.query
    let res = await Community.findActivity(currentPage)
    ctx.body = res
})

router.get('/getKnowledge', async(ctx)=>{
    let {currentPage} = ctx.request.query
    let res = await Community.findKnowledge(currentPage)
    ctx.body = res
})



router.get('/detail',async(ctx)=>{
    let {activity_id,type} = ctx.request.query
    activity_id = parseInt(activity_id)
    type = parseInt(type)
    let activity = await Community.getData(activity_id,type)
    ctx.body = activity

})

router.post('/upLoadActivity',new Auth().m, async(ctx)=>{
    const v = await new ActivityValidator().validate(ctx)
    const {type} = v.get('body') 
    let activity_info = v.get('body')
    const res = await Community.saveActivityInfoToOther(activity_info,ctx.auth.uid)
    const ids = await res.get('id')
    await Community.saveActivityInfo(ids,type,ctx.auth.uid)
    ctx.body = {
        type,
        activity_id:ids
    }
    

})

module.exports = router