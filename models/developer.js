let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    name: {
            firstName:{
                type: String,
                required: true
            },
            lastName:String,
           },

    level:{
        type: String,
        validate:{
            validator: function(levelValue){
                return levelValue === 'BEGINNER' || levelValue === 'EXPERT';

            },

            message: 'Level must either be Beginner or Expert'

        },
    },

    address:{
        state: String,
        suburb: {
            type: String},
        street: {
            type: String
        },
        unit: {
            type: String
        }
    }
})

let developerModel = mongoose.model('Developer', developerSchema);
module.exports = developerModel;
