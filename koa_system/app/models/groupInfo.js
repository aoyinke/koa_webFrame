
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class GroupInfo extends Model {
    

    static async groupRegister(groupName,groupType,desctiption,coverImg,logo,category,startTime){

        return await GroupInfo.create({
            groupName,
            groupType,
            desctiption,
            coverImg,
            logo,
            category,
            startTime
        })

    }

    
    
}


GroupInfo.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    groupName:{type:Sequelize.STRING},
    groupType:{type:Sequelize.STRING},
    desctiption:{type:Sequelize.STRING},
    coverImg:{type:Sequelize.STRING},
    logo:{type:Sequelize.STRING},
    category:{type:Sequelize.STRING},
    startTime:{type:Sequelize.DATEONLY}
}, { sequelize, tableName: 'groupInfo' })


module.exports = {
    GroupInfo
}