import mongoose, { Types, Schema } from "mongoose";

export enum ContestRegStatus {
    REGISTERED = "REGISTERED",
    CANCELLED = "CANCELLED"
}

export type GICContestRegDocument = Document & {
    registeredBy: Types.ObjectId
    registeredAt: number
    status: ContestRegStatus
    members: { // first person is leader
        name: string
        email: string
        school: string
        major: string
    }[]
}

const GICContestRegSchema = new Schema<GICContestRegDocument>({
    registeredBy: { type: Schema.Types.ObjectId, ref: "users" },
    registeredAt: Number,
    status: { type: String, enum: ContestRegStatus },
    members: [{
        name: String,
        email: String,
        school: String,
        major: String,
    }]
})

const GICContestRegModel = mongoose.model<GICContestRegDocument>("gic_contest_regs", GICContestRegSchema)
export default GICContestRegModel
