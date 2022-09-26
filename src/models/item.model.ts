import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export type PriceHistory = {
    email: string;
    createdAt: number;
    price: number;
};

export type ItemDocument = Document & {
    ownerId: string;
    name: string;
    imgUrl: string;
    description: string;
    value: string;
    priceHistory?: PriceHistory[];
};

const itemSchema = new Schema<ItemDocument>({
    ownerId: String,
    name: String,
    imgUrl: String,
    description: String,
    value: String,
    priceHistory: [{ email: String, createdAt: Number, price: Number }],
});

const Item = mongoose.model<ItemDocument>('Item', itemSchema);

export default Item;
