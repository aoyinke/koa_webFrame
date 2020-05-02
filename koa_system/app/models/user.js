const bycrypt = require('bcryptjs')
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class User extends Model {
    static async vertifyEmailPassword(account, plainPassword) {
        const user = await User.findOne({
            where: {
                email: account
            }
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


    static async getUserOpenId(openid){
        let user = User.findOne({
            where:openid
        })
        return user
    }

    static async registerUserOpenId(openid){
        return await User.create({
            openid
        })
    }
}


User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickName: {
        type: Sequelize.STRING,

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
        type: Sequelize.STRING
    },
    sex:{type: Sequelize.STRING},
    birthday:{type: Sequelize.STRING},
    job:{type: Sequelize.STRING},
    homeTown:{type: Sequelize.STRING},
    love:{type: Sequelize.STRING},
    intersetsTag:{type: Sequelize.STRING},
    coverImg:{type: Sequelize.STRING},
    selfDescription:{type: Sequelize.STRING},
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, { sequelize, tableName: 'user' })


module.exports = {
    User
}