import { injectable, inject } from 'inversify';
import {
    ErrorBidInvalid,
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

        const newMarketplaceItem = new MarketplaceItem({
            itemId: item._id.toString(),
            minPrice: minPrice,
            maxPrice: maxPrice,
            currentPrice: minPrice,
            createdAt: Date.now(),
            expiredAt: expiredAt,
            ownerName: owner.username,
        });

        await newMarketplaceItem.save();
        return newMarketplaceItem;
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
        const {
            itemId,
            currentPrice,
            minPrice,
            maxPrice,
            priceHistory,
            ownerName,
        } = marketplaceItem;

        if (bidPrice < minPrice) {
            throw new ErrorBidInvalid(
                'Bid price must be greater than or equal to min price',
            );
        }

        // Between min and max price
        if (minPrice <= bidPrice && bidPrice < maxPrice) {
            // Compare with currentPrice
            if (bidPrice <= currentPrice) {
                throw new ErrorBidInvalid(
                    'Bid price must be greater than or equal to current price',
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
            marketplaceItem.expiredAt = Date.now();
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

    async getMarketplaceItems() {
        const marketplaceItems = await MarketplaceItem.find({
            expiredAt: { $gt: Date.now() },
        });
        return marketplaceItems;
    }
}
