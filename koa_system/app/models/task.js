
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')
const fs = require('fs')
const {User} = require('./user')
const {GroupInfo} = require('./groupInfo')
class Task extends Model{

    static async getTaskInfo(taskId){
        let taskInfo = await Task.findOne({
            where:{
                id:taskId
            },
            raw:true
        })
        let taskImgs = await TaskImgs.findAll({
            where:{
                taskId
            },
            raw:true
        })

        let members = await TaskMember.findAll({
            where:{
                taskId
            },
            raw:true
        })
        let uids = members.map(member=>{
            return member.uid
        })
        let user = await User.findAll({
            where:{
                id:{
                    [Op.in]:uids
                }
            },
            raw:true,
            attributes:['nickName','id','avatar']
        })
        members = members.map(member=>{
            let userInfo = user.find(item=>item.id === member.uid)
            return Object.assign(member,userInfo)
        })

        taskInfo.taskImgs = taskImgs.map(taskImg=>{
            return taskImg.url
        })
        taskInfo.joinedPeople = members
        return taskInfo
    }

    

    static async getTaskList(groupId,belongActivity){
        let finder = {}
        if(belongActivity){
            finder = {
                groupId,
                belongActivity
            }
        }
        finder = {groupId}
        let tasks = await Task.findAll({
            where:finder,
            raw:true
        })        
        return tasks
    }

    static async addTask(taskInfo,uid){
        
            let task = await Task.create({
                uid,
                ...taskInfo
            })
            taskInfo.joinedPeopleList.forEach(async joinedPeople=>{
                await TaskMember.create({
                    uid:joinedPeople.uid,
                    taskId:task.id
                })
            })
            return task
            
       
        
    }
    static async changeTask(taskInfo){
        await Task.update({
            ...taskInfo
        },{
            where:{
                id:taskInfo.taskId
            }
        })
    }
    static async deleteTask(taskId){

        let taskImgs = await TaskImgs.findAll({
            where:{
                taskId
            }
        })
        return sequelize.transaction(async t=>{
            await Task.destroy({
                force:true,
                transaction:t,
                where:{
                    id:taskId
                }
            })
            
            if(taskImgs.length){
                await TaskImgs.destroy({
                    force:true,
                    transaction:t,
                    where:{
                        taskId
                    }
                })
            }
           
        })
    }
}



Task.init({
    uid:{type:Sequelize.INTEGER},
    groupId:Sequelize.INTEGER,
    content:Sequelize.STRING,
    click_nums:{type:Sequelize.INTEGER,defaultValue:0},
    belongActivity:Sequelize.STRING,
    taskName:Sequelize.STRING,
    deadLine:Sequelize.STRING,
    coverImg:Sequelize.STRING,
    concernEvent:Sequelize.STRING

},{ sequelize, tableName: 'task' })

class TaskImgs extends Model{
    static async deleteTaskImg(taskId,url){
        let img = await TaskImgs.findOne({
            where:{
                taskId,
                url
            }
        })

        if(!img){
            throw new global.errs.CoverImgError()
        }

        let pathUrl = url.replace(basicUrl,'')

        return sequelize.transaction(async t=>{
            await img.destroy({
                force:true,
                transaction:t
            })  
            fs.unlinkSync(pathUrl)
            
        })
        
        
    }
}

TaskImgs.init({
    taskId:Sequelize.INTEGER,
    url:Sequelize.STRING
},{ sequelize, tableName: 'taskImgs' })

class TaskMember extends Model{

}
TaskMember.init({
    uid:Sequelize.INTEGER,
    taskId:Sequelize.INTEGER
},{ sequelize, tableName: 'taskMember' })


class TaskMessages extends Model{
    static async getGroupMessage(groupId,taskId){
        let messageList = await TaskMessages.findAll({
            where:{
                groupId,
                taskId
            },
            raw:true
        })

        let uids = messageList.map(item=>item.uid)
        let userList = await User.findAll({
            where:{
                id:{
                    [Op.in]:uids
                }
            },
            raw:true,
            attributes:['nickName','id','avatar']
        })

        messageList = messageList.map(item=>{
            let userInfo = userList.find(user=> user.id === item.uid)
            return Object.assign(item,userInfo)
        })

        return messageList
    }   
}
TaskMessages.init({
    uid:Sequelize.INTEGER,
    taskId:Sequelize.INTEGER,
    groupId:Sequelize.INTEGER,
    message:Sequelize.STRING
},{ sequelize, tableName: 'taskMessages' })

module.exports = {
    Task,
    TaskImgs,
    TaskMember,
    TaskMessages
    
}