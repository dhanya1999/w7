let mongoose = require('mongoose');

let tasksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        
    },

    assign_to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },

    duedate: {
        type: Date,
         
     },

    taskStatus:{
        type: String,
        validate:{
            validator: function(taskStatusValue){
                return taskStatusValue === 'InProgress' || taskStatusValue === 'Complete';

            },

            message: 'Task status should be either Complete or Inprogress'

        },
        
    },

        taskDescription: {
            type: String,
            
        }
    
 
})

let tasksModel = mongoose.model('Task', tasksSchema);
module.exports = tasksModel;
