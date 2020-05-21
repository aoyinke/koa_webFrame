
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class Collections extends Model{

    static async addCollection(collectionInfo){
        await Collections.create({
            ...collectionInfo
        })
    }



}
Collections.init({
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
    collectionId:Sequelize.INTEGER,
    url:Sequelize.STRING
}, { sequelize, tableName: 'collectionsImgs' })


module.exports = {
    Collections,
    CollectionsImgs
}