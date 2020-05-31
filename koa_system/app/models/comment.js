
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

const {GroupInfo} = require('.././models/groupInfo')
const {User} = require('../models/user')
class Comment extends Model {
    
    static async addActivityComment(commentInfo,uid){
        
        return await Comment.create({
            uid,
            ...commentInfo
        })
    }

    static async getComment(activity_id){
        const comments = await Comment.findAll({
            where:{activity_id},
            raw:true,
            attributes:{exclude:['updateAt','deleteAt']}
        })
        
        return comments
    }


    
}


Comment.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid:{type:Sequelize.INTEGER},
    activity_id:{type:Sequelize.INTEGER},
    type:{type:Sequelize.INTEGER},
    content:{type:Sequelize.STRING},
    likeNum:{type:Sequelize.INTEGER,defaultValue:0},
}, { sequelize, tableName: 'comment' })


module.exports = {
    Comment
}