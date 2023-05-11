import mongoose, { Types, Schema } from "mongoose";

export type GICContestRegDocument = Document & {
    registeredBy: Types.ObjectId
    registeredAt: number
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
    members: [{
        name: String,
        email: String,
        school: String,
        major: String,
    }]
})

const GICContestRegModel = mongoose.model<GICContestRegDocument>("gic_contest_regs", GICContestRegSchema)
export default GICContestRegModel
