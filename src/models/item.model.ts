import mongoose, { Document, Types } from 'mongoose';

const Schema = mongoose.Schema;

export type Collection = 'Sticker' | 'Keychain' | 'Bracelet' | 'Tote';

export type PriceHistory = {
    email: string;
    name: string;
    createdAt: number;
    price: number;
};

export type ItemDocument = Document & {
    ownerId: Types.ObjectId;
    name: string;
    imgUrl: string;
    description: string;
    currentPrice: number;
    collectionName: Collection;
    priceHistory?: PriceHistory[];
};

const itemSchema = new Schema<ItemDocument>({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    imgUrl: String,
    description: String,
    currentPrice: Number,
    collectionName: String,
    priceHistory: [
        { email: String, name: String, createdAt: Number, price: Number },
    ],
});

const Item = mongoose.model<ItemDocument>('Item', itemSchema);

export default Item;
