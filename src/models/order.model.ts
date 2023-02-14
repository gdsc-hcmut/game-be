import mongoose, { Document, mongo, ObjectId } from 'mongoose';

const Schema = mongoose.Schema;

export type OrderDocument = Document & {
    description: string;
    status: string;
    transactionId: ObjectId;
    marketplaceItemId: ObjectId;
};

const orderSchema = new Schema<OrderDocument>({
    description: String,
    status: String,
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    marketplaceItemId: { type: Schema.Types.ObjectId, ref: 'MarketplaceItem' },
});

const Order = mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;
