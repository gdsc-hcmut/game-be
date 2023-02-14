import mongoose, { Document } from 'mongoose';
import { Collection } from './item.model';

const Schema = mongoose.Schema;

export type PriceHistory = {
    email: string;
    name: string;
    createdAt: number;
    price: number;
};

export type MarketplaceItemDocument = Document & {
    itemId: string;
    collectionName: Collection;
    currentPrice: number;
    currentBidUserId?: string;
    followedUsers?: string[];
    minPrice: number;
    maxPrice: number;
    title: string;
    note: string;
    priceHistory?: PriceHistory[];
    createdAt: number;
    expiredAt: number;
    ownerName: string;
    claimed: boolean;
};

const marketplaceItemSchema = new Schema<MarketplaceItemDocument>({
    itemId: String,
    currentPrice: Number,
    collectionName: String,
    currentBidUserId: String,
    followedUsers: [String],
    minPrice: Number,
    maxPrice: Number,
    title: String,
    note: String,
    priceHistory: [
        { email: String, name: String, createdAt: Number, price: Number },
    ],
    createdAt: Number,
    expiredAt: Number,
    ownerName: String,
    claimed: Boolean,
});

const MarketplaceItem = mongoose.model<MarketplaceItemDocument>(
    'MarketplaceItem',
    marketplaceItemSchema,
);

export default MarketplaceItem;
