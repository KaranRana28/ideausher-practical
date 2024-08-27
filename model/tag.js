const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: { createdAt: true, updatedAt: true } })

const tag = mongoose.model('tag', tagSchema);
module.exports = tag