
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class Task extends Model{

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

module.exports = {
    Task,
    TaskImgs,
    TaskMember
}