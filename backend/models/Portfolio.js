const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
    name:{
       type: String
    },
    description:{
        type: String
    },
    images: {
        type: [String], 
        required: true
      },
    category:{
        type: String
    }
})

module.exports = mongoose.model("Portfolio", portfolioSchema);