const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLE } = require('../constant/userConstant');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'User',
        enum: USER_ROLE
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    firstName: {
        type: String,
        default: '',
    },
    lastName: {
        type: String,
        default: '',
    },
    password: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    lastLoginDate: {
        type: Date
    },
    lastAccessDate: {
        type: Date
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    this.isDeleted = false;
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.index({ email: 1, role: 1 })
userSchema.index({ email: 1, role: 1, isActive: 1 })

// userSchema.index({ email: 1, isDeleted: 1, password: 1 })
// userSchema.index({ _id: 1, role: 1 })
// userSchema.index({ isDeleted: 1, role: 1, email: 1, firstName: 1, lastName: 1 })
// userSchema.index({ email: 1, isDeleted: 1, isActive: 1 })
// userSchema.index({ isDeleted: 1, role: 1, createdAt: -1 })

const user = mongoose.model('user', userSchema);
module.exports = user