const Router = require('koa-router')
const nodemailer = require('nodemailer')
const { host, port, user, pass, code, expire } = require('../../../config/config').smtp
const router = new Router({
    prefix: '/v1/user'
})


router.post('/sendEmail', async(ctx) => {
    let email = ctx.request.body.email
    let usernmae = ctx.request.body.username
    let transporter = nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
            user,
            pass
        }
    })
    let ko = {
        code: code(),
        expire: expire(),
        email,
        user: usernmae
    }
    let mailOptions = {
        from: `"认真邮件"<${user}>`,
        to: ko.email,
        subject: "《gengyc模仿的美团网站》注册码",
        html: `您在《gengyc模仿的美团网站》中注册，您的邀请码是${ko.code}`
    }

    await transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            throw new global.err.AuthFailed("邮箱验证码校验失败")
        } else {
            return ctx.body = {
                code: ko.code,
                mess: "发送邮箱验证码成功"
            }
        }
    })
})

module.exports = router