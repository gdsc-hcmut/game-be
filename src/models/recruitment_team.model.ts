import mongoose, { Schema, Types } from 'mongoose';

export type TeamDocument = Document & {
    name: string;
    leadId: Types.ObjectId;
    memberIds: [Types.ObjectId];
};

const teamSchema = new Schema<TeamDocument>({
    name: { type: String, unique: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'User' },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const teamSchemaModel = mongoose.model<TeamDocument>(
    'recruitment_team',
    teamSchema,
);

export default teamSchemaModel;
