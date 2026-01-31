import mongoose, { Schema, model, models } from 'mongoose';

const KnowledgeItemSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    summary: {
        type: String,
    },
    type: {
        type: String,
        enum: ['note', 'link', 'insight'],
        default: 'note',
    },
    tags: [{
        type: String,
        trim: true,
    }],
    sourceUrl: {
        type: String,
        trim: true,
    },
    fileName: {
        type: String,
    },
    fileType: {
        type: String,
    },
    fileUrl: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

KnowledgeItemSchema.pre('save', function () {
    (this as any).updatedAt = new Date();
});

const KnowledgeItem = models.KnowledgeItem || model('KnowledgeItem', KnowledgeItemSchema);

export default KnowledgeItem;
