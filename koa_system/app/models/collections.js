
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class Collections extends Model{

    static async getColleciton(type,groupId){
        let collections = await Collections.findAll({
            where:{
                type,
                groupId
            },
            raw:true
        })

        for(let i in collections){
            let {type,id}  = collections[i]
            let collecitonImgs = await CollectionsImgs.findAll({
                where:{
                    collectionId:id,
                    type
                },
                raw:true
            })
            collections[i].images = collecitonImgs
        }

        return collections
    }
}
Collections.init({
    type:Sequelize.INTEGER,
    groupId:Sequelize.INTEGER,
    picture:Sequelize.STRING,
    title:Sequelize.STRING,
    description:Sequelize.STRING,
    content:Sequelize.STRING,
    fav_nums:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    like_nums:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }

}, { sequelize, tableName: 'collections' })


class CollectionsImgs extends Model{

    
}

CollectionsImgs.init({
    type:Sequelize.INTEGER,
    collectionId:Sequelize.INTEGER,
    url:Sequelize.STRING
}, { sequelize, tableName: 'collectionsImgs' })


module.exports = {
    Collections,
    CollectionsImgs
}