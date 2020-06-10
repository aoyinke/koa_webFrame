
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')
const fs = require('fs')
const path = require('path')

const activityInfoDetails = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid:Sequelize.INTEGER,
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    videoSrc:Sequelize.STRING,
    description:Sequelize.STRING,
    fav_nums: {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    like_nums:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    title: Sequelize.STRING,
    groupId: {
        type: Sequelize.STRING
    },
    category:{
        type: Sequelize.STRING
    }
}


class ActivityImgs extends Model{
    static async deleteImg(url){
        let imgPath = path.join(__dirname,url)
        imgPath = imgPath.split('\\').reduce((accumulator,currentValue)=>{
            return accumulator + '/' + currentValue
        })
        ActivityImgs.destroy({
            where:{
                url
            }
        })
        fs.unlinkSync(imgPath)
        
    }
}
ActivityImgs.init({
    activity_id: Sequelize.INTEGER,
    type:Sequelize.INTEGER,
    url:Sequelize.STRING

}, { sequelize, tableName: 'activityImgs' })




class GroupDynamic extends Model {
    
}
GroupDynamic.init(activityInfoDetails, { sequelize, tableName: 'groupDynamic' })

class Knowledge extends Model{

}
Knowledge.init(activityInfoDetails, { sequelize, tableName: 'Knowledge' })

class Activity extends Model{

}
Activity.init(Object.assign({},{deadline:Sequelize.STRING},activityInfoDetails), { sequelize, tableName: 'activity' })

class Answer extends Model{

}

Answer.init(activityInfoDetails, { sequelize, tableName: 'answer' })


module.exports = {
    GroupDynamic,
    Knowledge,
    Activity,
    Answer,
    ActivityImgs
}