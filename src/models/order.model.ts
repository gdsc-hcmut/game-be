import mongoose, { Document, mongo } from 'mongoose';

const Schema = mongoose.Schema;

export type OrderDocument = Document & {
    description: string;
    status: string;
    transactionId: string;
    marketplaceItemId: string;
};

const orderSchema = new Schema<OrderDocument>({
    description: String,
    status: String,
    transactionId: String,
    marketplaceItemId: String,
});

const Order = mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;
