import mongoose, { Document, Schema, Types } from "mongoose";

export enum DayRegStatus {
    REGISTERED = "REGISTERED",
    CANCELLED = "CANCELLED",
    CHECKIN = "CHECKIN"
}

export type DayRegDocument = Document & {
    registeredBy: Types.ObjectId,
    registeredAt: number
    day: number,
    status: DayRegStatus

    invitedBy: Types.ObjectId
}

const dayRegSchema = new Schema<DayRegDocument>({
    registeredBy: { type: Schema.Types.ObjectId, ref: "User" },
    registeredAt: Number,
    day: Number,
    status: { type: String, enum: DayRegStatus },

    invitedBy: { type: Schema.Types.ObjectId, ref: "User" }
})

const DayRegModel = mongoose.model<DayRegDocument>("day_registrations", dayRegSchema)
export default DayRegModel
