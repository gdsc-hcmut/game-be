import mongoose, { Schema, Types } from 'mongoose';

export type TeamDocument = Document & {
    name: string;
    members: [string];
};

const teamSchema = new Schema<TeamDocument>({
    name: { type: String, unique: true, index: true },
    members: [String],
});

const teamSchemaModel = mongoose.model<TeamDocument>(
    'recruitment_team',
    teamSchema,
);

export default teamSchemaModel;
