import { injectable } from 'inversify';
import MarketplaceItem, {
    MarketplaceItemDocument,
} from '../models/marketplace_item.model';
import Item, { ItemDocument } from '../models/item.model';
import { ErrorItemInvalid, ErrorUserInvalid } from '../lib/errors';
import User from '../models/user.model';

@injectable()
export class MarketplaceItemService {
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

        const newMarketplaceItem = new MarketplaceItem();
        newMarketplaceItem.itemId = item._id;
        newMarketplaceItem.minPrice = minPrice;
        newMarketplaceItem.maxPrice = maxPrice;
        newMarketplaceItem.currentPrice = minPrice;
        newMarketplaceItem.createdAt = Date.now();
        newMarketplaceItem.expiredAt = expiredAt;
        newMarketplaceItem.ownerName = owner.username;
        await newMarketplaceItem.save();
        return newMarketplaceItem;
    }
}
