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
    let {activity_id,type,content} = v.get('body')
    await Comment.addActivityComment(activity_id,content,type,ctx.auth.uid)
    success("成功添加了评论~")

})

router.get('/activity', async(ctx)=>{
    const v = await new ActivityValidator().validate(ctx)
    let {currentPage = 1} = ctx.request.query
    
    
    // const {type,status,title,content,groupId} = v.get('body')
    let res = await Community.GetActivityInfo(1,currentPage)
    ctx.body = res
})

router.post('/upLoadActivity',new Auth().m, async(ctx)=>{
    const v = await new ActivityValidator().validate(ctx)
    const {type,status,title,content,groupId} = v.get('body') 
    const res = await Community.saveActivityInfoToOther(type,status,title,content,groupId)
    const ids = await res.get('id')
    await Community.saveActivityInfo(ids,type,ctx.auth.uid)
    success()
    

})

module.exports = router