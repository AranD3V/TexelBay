const { status } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssetSchema = new Schema({
    creator :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title :{
        type: String,
        required: true,
        trim: true
    },
    description :{
        type: String,
        required: true,
    },
    price :{
        type: Number,
        required: true,
        min: 0
    },
    assetFileKey :{
        type: String,
        required: true
    },
    previewImageKey :[{
        type: String,
    }],
    tags :[{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'archived'],
        default: 'pending'
    },
}, {timestamps: true});

module.exports = mongoose.model('Asset', AssetSchema);
