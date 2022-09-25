import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from './controller';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { AuthService, ItemService } from '../services';
import { ItemDocument } from '../models/item.model';
import { UserDocument } from '../models/user.model';

@injectable()
export class ItemController extends Controller {
    public readonly router = Router();
    public readonly path = '/item';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Item) private itemService: ItemService,
    ) {
        super();

        // Configuring child routes
        this.router.get('/public/items/:itemId', this.getItemById.bind(this));

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.post('/private/items', this.createNewItem.bind(this));
        this.router.get('/private/items', this.getUserItems.bind(this));
    }

    async createNewItem(req: Request, res: Response) {
        try {
            const item: ItemDocument = _.pick(req.body, [
                'name',
                'imgUrl',
                'description',
                'value',
                'priceHistory',
            ]) as any;
            const ownerId = req.tokenMeta.userId.toString();
            console.log('userId:::', ownerId);
            item.ownerId = ownerId;

            const newItem = await this.itemService.createNewItem(item);
            res.composer.success(newItem);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getItemById(req: Request, res: Response) {
        try {
            const { itemId } = req.params;

            const item = await this.itemService.getItemById(itemId);
            res.composer.success(item);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getUserItems(req: Request, res: Response) {
        try {
            // const user = req.tokenMeta as UserDocument;
            console.log(req.tokenMeta);
            const userId = req.tokenMeta.userId.toString();

            const items = await this.itemService.getUserItems(userId);

            return res.composer.success(items);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
