const bycrypt = require('bcryptjs')
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')
const {basicUrl,defaultCoverImgs} = require('../../config/config')
class User extends Model {
    static async vertifyEmailPassword(account, plainPassword) {
        const user = await User.findOne({
            where: {
                email: account
            },
            
        })
        
        if (!user) {
            throw new global.errs.NotFound('用户不存在')
        }
        const correct = bycrypt.compareSync(plainPassword, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }


    static async getUserInfo(uid){
        const user = await User.findOne({
            where:{
                id:uid
            },
            raw:true,
            attributes:{exclude:['password','email','openid']}
        })

        let  coverImgs = await UserCoverImgs.findAll({
            where:{
                uid
            },
            raw:true,
            attributes:['url']
        })
        coverImgs = coverImgs.map(item=>{
            return item.url
        })
        user.coverImgs = coverImgs
        return user
    }
    
    static async getUserByOpenid(openid){
        const user = await User.findOne({
            where:{
                openid
            }
        })
        return user
    }
    static async registerUserOpenId(openid){
        let user = await User.create({
            openid
        })
        
        defaultCoverImgs.forEach(async url=>{
            await UserCoverImgs.create({
                uid:user.id,
                url
            })
        })
        return user
        
    }
}

class UserCoverImgs extends Model{

}

UserCoverImgs.init({
    uid:Sequelize.INTEGER,
    url:{type:Sequelize.STRING,defaultValue:""}
}, { sequelize, tableName: 'userCoverImgs' })

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickName: {
        type: Sequelize.STRING,
        defaultValue:"一只无名的仓鼠"

    },
    email: {
        type: Sequelize.STRING,
        unique: true

    },
    password: {
        type: Sequelize.STRING,
        set(val) {
            const salt = bycrypt.genSaltSync(10)
            const pwd = bycrypt.hashSync(val, salt)
            this.setDataValue('password', pwd)
        }

    },
    avatar:{
        type: Sequelize.STRING,
        defaultValue:basicUrl + "static/defaultAvatar.jpg"
        
    },
    sex:{
        type: Sequelize.STRING,
        defaultValue:"男"
    },
    birthday:{type: Sequelize.STRING,defaultValue:""},
    job:{type: Sequelize.STRING,defaultValue:"组团打野"},
    homeTown:{type: Sequelize.STRING,defaultValue:""},
    love:{type: Sequelize.STRING,defaultValue:"单身狗"},
    interestsTag:{type: Sequelize.STRING,defaultValue:""},
    tags:{type:Sequelize.STRING,defaultValue:"可爱,帅气"},
    description:{type: Sequelize.STRING,defaultValue:"这个人很懒~啥介绍都没有"},
    activity:{type: Sequelize.STRING,defaultValue:"快去参加一些有趣的活动吧！"},
    college:Sequelize.STRING,
    achievement:{type: Sequelize.STRING,defaultValue:"哪怕是咸鱼也是要有成就的啊！"},
    likeNums:{type:Sequelize.INTEGER,defaultValue:0},
    concernNum:{type:Sequelize.INTEGER,defaultValue:0},
    publishedNum:{type:Sequelize.INTEGER,defaultValue:0},
    coverImgs:{type:Sequelize.STRING,defaultValue:"https://images.mepai.me/app/works/38224/2019-12-25/w_5e02b44081594/05e02b440816c9.jpg",},
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, { sequelize, tableName: 'user' })


module.exports = {
    User,
    UserCoverImgs
}