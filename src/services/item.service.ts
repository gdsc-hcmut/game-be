import { injectable } from 'inversify';
import Item, { ItemDocument } from '../models/item.model';
import RandomPool, { RandomPoolDocument } from '../models/random_pool.model';

@injectable()
export class ItemService {
    async createMany(
        item: ItemDocument,
        quantity: number,
        isAutoSendToRandomPool: boolean = false,
    ): Promise<boolean> {
        let items = [];
        for (let i = 0; i < quantity; i++) {
            items.push({ ...item });
        }
        items = await Item.insertMany(items);
        if (isAutoSendToRandomPool) {
            const itemIds: string[] = items.map((item) => item._id.toString());
            const pool = await RandomPool.findOne();
            pool.itemIds = [...itemIds, ...pool?.itemIds];
            await pool.save();
        }
        return true;
    }

    async createNewItem(item: ItemDocument): Promise<ItemDocument> {
        let newItem = new Item();
        const { ownerId, name, imgUrl, description, value } = item;
        newItem.ownerId = ownerId;
        newItem.name = name;
        newItem.imgUrl = imgUrl;
        newItem.description = description;
        newItem.value = value;
        await newItem.save();
        return newItem;
    }

    async getItemById(itemId: string): Promise<ItemDocument> {
        const item = await Item.findById(itemId);
        return item;
    }

    async getUserItems(userId: string): Promise<ItemDocument[]> {
        const items = await Item.find({ ownerId: userId });
        return items;
    }

    async updateItemById(itemId: string, update: any): Promise<ItemDocument> {
        const updatedItem = await Item.findByIdAndUpdate(itemId, update, {
            new: true,
        });
        return updatedItem;
    }
}
