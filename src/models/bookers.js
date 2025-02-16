const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
    fullname:{
        type: String,
        trim:true,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type:String,
        required:true    
    },
    gender:{
        type:String,
        required:true    
    },
    state:{
        type:String,
        required:true    
    },
    city:{
        type:String,
        required:true    
    },
    stype:{
        type:String,
        required:true 
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
    
})


const Booker = new mongoose.model("Booker", bookSchema)
module.exports = Booker