const mongoose = require("mongoose");
const {Schema} =  mongoose;

const parentSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    parentId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:["Active", "Inactive"],
        default: "Active"
    },
    children:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }],
    password:{
        type:String,
        required: true
    }
}, {timestamps: true});

const Parent = mongoose.model('Parent', parentSchema);
module.exports = Parent;