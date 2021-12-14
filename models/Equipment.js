const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 255 },
    description: { type: String, required: true},
    
    dateModified: {type: Date, default: Date.now },
});

const Product = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;