import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from './controller';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { AuthService, ItemService, UserService } from '../services';
import { ItemDocument } from '../models/item.model';
import { USER_TYPES } from '../models/user.model';
import { ErrorUserInvalid } from '../lib/errors';

@injectable()
export class ItemController extends Controller {
    public readonly router = Router();
    public readonly path = '/';

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
        this.router.patch(
            '/private/items/:itemId',
            this.updateItemById.bind(this),
        );
    }

    async createNewItem(req: Request, res: Response) {
        try {
            const item = _.pick(req.body, [
                'name',
                'imgUrl',
                'description',
                'value',
                'quantity',
                'isAutoSendToRandomPool',
            ]) as any;
            const ownerId = req.tokenMeta.userId.toString();
            item.ownerId = ownerId;

            if (item.quantity) {
                await this.itemService.createMany(
                    item,
                    item.quantity,
                    item.isAutoSendToRandomPool,
                );
                res.composer.success(`Created ${item.quantity} new items`);
                return;
            }
            // TODO
            // const user = await this.userService.findById(ownerId);
            // if (user.type !== USER_TYPES.SYSTEM) {
            //     throw new ErrorUserInvalid('User not allow to create new item');
            // }

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
            const userId = req.tokenMeta.userId.toString();

            const items = await this.itemService.getUserItems(userId);

            return res.composer.success(items);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async updateItemById(req: Request, res: Response) {
        try {
            const { itemId } = req.params;
            const update = _.pick(req.body, [
                'name',
                'imgUrl',
                'description',
                'value',
            ]);
            const updatedItem = await this.itemService.updateItemById(
                itemId,
                update,
            );
            res.composer.success(updatedItem);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
