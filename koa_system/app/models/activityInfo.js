
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')



const activityInfoDetails = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type:Sequelize.STRING,
    },
    video: {
        type:Sequelize.STRING,
    },
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    title: Sequelize.STRING,
    groupId: {
        type: Sequelize.STRING
    },
    saveNum:{
        type: Sequelize.STRING
    },
    category:{
        type: Sequelize.STRING
    },
    commentID:{
        type: Sequelize.STRING
    }
}

class GroupDynamic extends Model {
    
}
GroupDynamic.init(activityInfoDetails, { sequelize, tableName: 'groupdynamic' })
class Knowledge extends Model{

}
Knowledge.init(activityInfoDetails, { sequelize, tableName: 'Knowledge' })

class Activity extends Model{

}
Activity.init(activityInfoDetails, { sequelize, tableName: 'activity' })

class Answer extends Model{

}

Answer.init(activityInfoDetails, { sequelize, tableName: 'answer' })

module.exports = {
    GroupDynamic,
    Knowledge,
    Activity,
    Answer
}