import mongoose from 'mongoose';

const UserActivitySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    IP: {
        type: String,
        required: true
    },
    UA: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('UserActivity', UserActivitySchema);