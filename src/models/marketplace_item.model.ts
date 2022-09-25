import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export type PriceHistory = {
    email: string;
    createdAt: number;
    price: number;
};

export type MarketplaceItemDocument = Document & {
    itemId: string;
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
    priceHistory: PriceHistory[];
    createdAt: number;
    expiredAt: number;
    ownerName: string;
};

const marketplaceItemSchema = new Schema<MarketplaceItemDocument>({
    itemId: String,
    currentPrice: Number,
    minPrice: Number,
    maxPrice: Number,
    priceHistory: [{ email: String, createdAt: Number, price: Number }],
    createdAt: Number,
    expiredAt: Number,
    ownerName: String,
});

const MarketplaceItem = mongoose.model<MarketplaceItemDocument>(
    'MarketplaceItem',
    marketplaceItemSchema,
);

export default MarketplaceItem;
