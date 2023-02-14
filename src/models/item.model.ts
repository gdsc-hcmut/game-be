import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export type Collection = 'Sticker' | 'Keychain' | 'Bracelet' | 'Tote';

export type PriceHistory = {
    email: string;
    name: string;
    createdAt: number;
    price: number;
};

export type ItemDocument = Document & {
    ownerId: string;
    name: string;
    imgUrl: string;
    description: string;
    currentPrice: string;
    collectionName: Collection;
    priceHistory?: PriceHistory[];
};

const itemSchema = new Schema<ItemDocument>({
    ownerId: String,
    name: String,
    imgUrl: String,
    description: String,
    currentPrice: String,
    collectionName: String,
    priceHistory: [
        { email: String, name: String, createdAt: Number, price: Number },
    ],
});

const Item = mongoose.model<ItemDocument>('Item', itemSchema);

export default Item;
