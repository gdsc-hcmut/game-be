import mongoose, { Document, Types } from 'mongoose';

const Schema = mongoose.Schema;

export type MobileDeviceDocument = Document & {
    userId: Types.ObjectId;
    deviceToken: string;
    isActive: boolean;
};

const deviceTokenSchema = new Schema<MobileDeviceDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deviceToken: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const MobileDevice = mongoose.model<MobileDeviceDocument>(
    'Mobile Device',
    deviceTokenSchema,
);

export default MobileDevice;
