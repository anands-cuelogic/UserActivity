import mongoose from 'mongoose';

const UserActivitySchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
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
        required: true
    }
});

export default mongoose.model('UserActivity', UserActivitySchema);