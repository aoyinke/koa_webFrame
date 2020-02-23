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
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, { sequelize, tableName: 'user' })


module.exports = {
    User
}