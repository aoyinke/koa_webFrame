const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')

const {ActivityValidator,AddCommentValidator} = require('@validator')
const {basicUrl} = require('../../../config/config')
const {Community} = require('../../models/community')
const {Comment} = require('../../models/comment')
const {User} = require('../../models/user')
const {ActivityImgs} = require('../../models/activityInfo')
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
    let {currentPage,category} = ctx.request.query
    let res = await Community.findActivity(currentPage,category)
    ctx.body = res
})

router.get('/community',new Auth().m, async (ctx)=>{
    let {currentPage,category} = ctx.request.query
    let communityList = await Community.getInfoList(currentPage,category)
    ctx.body = communityList
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

router.get('/userLiked',new Auth().m,async(ctx)=>{
    let {type,currentPage} = ctx.request.query
    let res = []
    let {interestsTag} = await User.findOne({
        id:ctx.auth.uid,
        raw:true,
        attributes:['interestsTag']
    })
    
    interestsTag = interestsTag.split(',')
    for(let i of interestsTag){
        
        let tmp = await Community.getCommunity(type,currentPage,i)
        res.push(...tmp)
    }
    ctx.body = res
})


router.post('/deleteCommunityImg',new Auth().m, async(ctx)=>{
    let {imgUrl} = ctx.request.body

    if(imgUrl){
        imgUrl = imgUrl.replace(basicUrl,'')
        await ActivityImgs.deleteImg(imgUrl)
    }
    ctx.body = "删除成功"
    
    

})
module.exports = router