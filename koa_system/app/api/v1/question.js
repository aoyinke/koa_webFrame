const Router = require('koa-router')
const router = new Router({
    prefix: '/v1/question'
})
const {Auth} = require('../../../middlewares/auth')
const {UserQuestion} = require('../../models/questions')

router.post('/submitQuestion',new Auth().m,async ctx=>{
    let {score,concat,content} = ctx.request.body
    let questionInfo = await UserQuestion.create({
        score,
        concat,
        content,
        uid:ctx.auth.uid
    })
    ctx.body = {id:questionInfo.id}
})

module.exports = router