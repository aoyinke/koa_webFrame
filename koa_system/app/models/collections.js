
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
    type:Sequelize.INTEGER,
    groupId:Sequelize.INTEGER,
    coverImg:Sequelize.STRING,
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