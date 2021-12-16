const Joi = require('joi');
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 255 },
    description: { type: String, required: true},
    list:{
        type:Array,
        default:[],
    },
    isAvailable: {type:String, default: "Available"},
    
    dateModified: {type: Date, default: Date.now },
});



module.exports.equipmentSchema = equipmentSchema;
module.exports.Equipment = mongoose.model("Equipment", equipmentSchema);