import { injectable } from 'inversify';
import Item, { ItemDocument } from '../models/item.model';

@injectable()
export class ItemService {
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
}
