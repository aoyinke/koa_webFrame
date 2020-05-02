
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

const {GroupInfo} = require('.././models/groupInfo')
class Comment extends Model {
    
    static async addActivityComment(activity_id,content,type,uid){
        
        return await Comment.create({
            activity_id,
            content,
            uid,
            type
        })
    }

    static async getComment(activity_id){
        
        const comments = Comment.findAll({
            where:activity_id
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
    likeStatus:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
}, { sequelize, tableName: 'comment' })


module.exports = {
    Comment
}