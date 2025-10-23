'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

var FollowSchema = Schema({ 
    user: { type: Schema.ObjectId, ref: 'User'},
    followed: { type: Schema.ObjectId, ref: 'User'}
});
FollowSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Follow', FollowSchema);