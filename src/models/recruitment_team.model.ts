import mongoose, { Schema, Types } from 'mongoose';

export type TeamDocument = Document & {
    name: string;
    members: [string];
    scores: [number];
    totalScore: number;
    miniGameMap: Array<Array<string>>;
};

const teamSchema = new Schema<TeamDocument>({
    name: { type: String, unique: true, index: true },
    members: [String],
    scores: [{ type: Number, default: [] }],
    totalScore: { type: Number, default: 0 },
    miniGameMap: [[{ type: String, default: [] }]],
});

const teamSchemaModel = mongoose.model<TeamDocument>(
    'recruitment_team',
    teamSchema,
);

export default teamSchemaModel;
