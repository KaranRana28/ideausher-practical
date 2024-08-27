const mongoose = require('mongoose');
const postConstant = require('../constant/postConstant');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: postConstant.POST_STATUS,
        default: postConstant.POST_STATUS.PUBLISHED
    },
    photo: [{ url: { type: String } }],
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: { createdAt: true, updatedAt: true } })

postSchema.index({ title: 1, description: 1 });
postSchema.index({ title: 1, description: 1, status: 1 });
postSchema.index({ status: 1, isDeleted: 1 });

const post = mongoose.model('post', postSchema);
module.exports = post