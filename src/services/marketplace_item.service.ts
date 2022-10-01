import { injectable, inject } from 'inversify';
import {
    ErrorBidInvalid,
    ErrorInvalidData,
    ErrorItemInvalid,
    ErrorUserInvalid,
} from '../lib/errors';

import MarketplaceItem, {
    MarketplaceItemDocument,
} from '../models/marketplace_item.model';
import Item, { ItemDocument } from '../models/item.model';
import User from '../models/user.model';
import Order, { OrderDocument } from '../models/order.model';
import Transaction from '../models/transaction.model';
import { ServiceType } from '../types';
import { TransactionService } from './transaction.service';
import { UserService } from './user.service';
import { ItemService } from './item.service';
import { SYSTEM_ACCOUNT_ID } from '../config';

@injectable()
export class MarketplaceItemService {
    constructor(
        @inject(ServiceType.Transaction)
        private transactionService: TransactionService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Item) private itemService: ItemService,
    ) {}

    async auctionNewItem(
        userId: string,
        itemId: string,
        minPrice: number,
        maxPrice: number,
        expiredAt: number,
    ): Promise<MarketplaceItemDocument> {
        const item = await Item.findById(itemId);
        if (!item) {
            throw new ErrorItemInvalid('Invalid item');
        }

        if (item.ownerId !== userId) {
            throw new ErrorUserInvalid('User not authorized');
        }
        const owner = await User.findById(userId);
        console.log('owner:::::', owner);

        const newMarketplaceItem = new MarketplaceItem({
            itemId: item._id.toString(),
            minPrice: minPrice,
            maxPrice: maxPrice,
            currentPrice: minPrice,
            createdAt: Date.now(),
            expiredAt: expiredAt,
            ownerName: owner.email, // TODO: change to owner.username when available
        });

        await newMarketplaceItem.save();
        return newMarketplaceItem;
    }

    async updateAuctionedItem(
        marketplaceItemId: string,
        update: {
            minPrice?: number;
            maxPrice?: number;
            expiredAt?: number;
        },
    ) {
        const updatedItem = await MarketplaceItem.findByIdAndUpdate(
            marketplaceItemId,
            update,
            { new: true },
        );
        return updatedItem;
    }

    async bidForItem(
        _itemId: string,
        bidPrice: number,
        fromUser: string,
        toUser: string,
    ): Promise<OrderDocument> {
        const marketplaceItem = await MarketplaceItem.findOne({
            itemId: _itemId,
        });
        console.log('marketplaceItem:::', marketplaceItem);

        const {
            itemId,
            currentPrice,
            currentBidUserId,
            minPrice,
            maxPrice,
            priceHistory,
            ownerName,
            expiredAt,
        } = marketplaceItem;

        if (expiredAt < Date.now()) {
            throw new ErrorInvalidData('Expired, cannot make bid');
        }

        const owner = await this.userService.findOne({ email: ownerName });

        if (fromUser === owner._id.toString()) {
            throw new ErrorInvalidData('You cannot buy your item.');
        }

        if (bidPrice < minPrice) {
            throw new ErrorInvalidData(
                'Bid price must be greater than or equal to min price',
            );
        }

        // Between min and max price
        if (minPrice <= bidPrice && bidPrice < maxPrice) {
            // Compare with currentPrice
            if (bidPrice <= currentPrice) {
                throw new ErrorInvalidData(
                    'Bid price must be greater than current price',
                );
            }

            // Create new order -> new transaction
            const newOrder = new Order();
            newOrder.description = `Bid item ${itemId} of ${ownerName}`;
            newOrder.status = 'success';
            newOrder.marketplaceItemId = itemId;
            // Transfer money to system account
            const newTransaction =
                await this.transactionService.createNewTransaction(
                    fromUser,
                    toUser,
                    bidPrice,
                );

            // Refund user currently bidding
            if (priceHistory.length > 0) {
                const prevBidder = await this.userService.findOne({
                    email: priceHistory[0].email,
                });
                const refundTransaction =
                    await this.transactionService.createNewTransaction(
                        toUser,
                        prevBidder._id.toString(),
                        priceHistory[0].price,
                    );
            }
            newOrder.transactionId = newTransaction._id.toString();
            await newOrder.save();
            // Write priceHistory of marketplaceItem
            const { email } = await User.findById(fromUser, { email: 1 });
            priceHistory.unshift({
                email,
                createdAt: Date.now(),
                price: bidPrice,
            });
            marketplaceItem.currentPrice = bidPrice;
            marketplaceItem.currentBidUserId = fromUser;
            if (!marketplaceItem.followedUsers.includes(fromUser)) {
                marketplaceItem.followedUsers.push(fromUser);
            }
            await marketplaceItem.save();
            return newOrder;
        }

        if (bidPrice >= maxPrice) {
            // If item is bought, write to priceHistory of item
            const newOrder = new Order();
            newOrder.description = `Buy item ${itemId} of ${ownerName}`;
            newOrder.status = 'success';
            newOrder.marketplaceItemId = itemId;
            // Transfer money from bidder to system account
            const newTransaction =
                await this.transactionService.createNewTransaction(
                    fromUser,
                    toUser,
                    bidPrice,
                );

            // Transer money from system account to item's owner
            const item = await this.itemService.getItemById(itemId);
            const newTrans = await this.transactionService.createNewTransaction(
                toUser,
                item.ownerId,
                bidPrice,
            );

            // Refund user currently bidding
            if (priceHistory.length > 0) {
                const prevBidder = await this.userService.findOne({
                    email: priceHistory[0].email,
                });
                const refundTransaction =
                    await this.transactionService.createNewTransaction(
                        toUser,
                        prevBidder._id.toString(),
                        priceHistory[0].price,
                    );
            }
            newOrder.transactionId = newTransaction._id.toString();
            await newOrder.save();
            // Write priceHistory of marketplaceItem
            const { email } = await User.findById(fromUser, { email: 1 });
            priceHistory.unshift({
                email,
                createdAt: Date.now(),
                price: bidPrice,
            });
            // Remove marketplace item
            // TODO: claimed = true
            marketplaceItem.expiredAt = Date.now();
            if (!marketplaceItem.followedUsers.includes(fromUser)) {
                marketplaceItem.followedUsers.push(fromUser);
            }
            await marketplaceItem.save();

            // Change owner of item, write priceHistory of item
            item.ownerId = fromUser;
            item.priceHistory.unshift({
                email,
                createdAt: Date.now(),
                price: bidPrice,
            });
            await item.save();
            return newOrder;
        }
    }

    async getAllMarketplaceItems() {
        const marketplaceItems = await MarketplaceItem.find({
            expiredAt: { $gt: Date.now() },
        }).sort({ createdAt: -1 });
        return marketplaceItems;
    }

    async getAuctionedItems(
        ownerName: string,
    ): Promise<MarketplaceItemDocument[]> {
        console.log('ownerName:::::::', ownerName);

        const auctionedItems = await MarketplaceItem.find({ ownerName });
        console.log('auctionedItems', auctionedItems);

        return auctionedItems;
    }

    async getBids(userId: string): Promise<MarketplaceItemDocument[]> {
        // user get bid that they have involved
        // if user own bid of bids, that bid will be showed until claimed
        let bids = await MarketplaceItem.find({
            followedUsers: { $elemMatch: { $eq: userId } },
            claimed: false,
        });
        console.log('bids:::', bids);

        // TODO: FE check if user owns bid, and if user has claim bid or not (userId ===currentBidUserId, claimed===true)

        return bids;
    }

    async findByItemId(itemId: string) {
        const item = await MarketplaceItem.findOne({ itemId });
        return item;
    }

    async findById(marketplaceItemId: string) {
        const marketplaceItem = await MarketplaceItem.findById(
            marketplaceItemId,
        );
        return marketplaceItem;
    }

    async claimBid(userId: string, bidId: string) {
        // Check if user is the current bid user
        const bid = await MarketplaceItem.findById(bidId);
        if (bid.currentBidUserId !== userId) {
            throw new ErrorInvalidData('You not own this bid');
        }

        // Check if it's right time or not?
        if (bid.expiredAt > Date.now()) {
            throw new ErrorInvalidData(
                'Bid time has not expired, cannot claim item',
            );
        }

        // Find previous owner
        const prevOwner = await this.userService.findOne({
            email: bid.ownerName,
        });

        // Transfer money from system account to previous owner
        const newTransaction =
            await this.transactionService.createNewTransaction(
                SYSTEM_ACCOUNT_ID,
                prevOwner._id.toString(),
                bid.currentPrice,
            );

        // Update owner of item
        const item = await this.itemService.getItemById(bid.itemId);
        item.ownerId = userId;
        const user = await this.userService.findById(userId);
        item.priceHistory.push({
            email: user.email,
            createdAt: Date.now(),
            price: bid.currentPrice,
        });
        await item.save();
        bid.claimed = true;
        await bid.save();
    }
}