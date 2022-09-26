import { Router } from 'express';
import { inject, injectable } from 'inversify';
import {
    AuthService,
    ItemService,
    MarketplaceItemService,
    UserService,
} from '../services';
import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';

@injectable()
export class MarketplaceController extends Controller {
    public readonly router = Router();
    public readonly path = '/marketplace';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.MarketplaceItem)
        private marketplaceItemService: MarketplaceItemService,
        @inject(ServiceType.User) private userService: UserService,
    ) {
        super();

        // Configuring child routes
        this.router.get('/public/items', this.getMarketplaceItems.bind(this));

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.post('/private/items', this.aunctionNewItem.bind(this));
        this.router.post('/private/orders', this.bidForItem.bind(this));
    }

    async getMarketplaceItems(req: Request, res: Response) {
        try {
            const marketplaceItems =
                await this.marketplaceItemService.getMarketplaceItems();
            res.composer.success(marketplaceItems);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async aunctionNewItem(req: Request, res: Response) {
        try {
            const userId = req.tokenMeta.userId.toString();
            const { itemId, minPrice, maxPrice, expiredAt } = req.body;
            const auctionedItem =
                await this.marketplaceItemService.auctionNewItem(
                    userId,
                    itemId,
                    minPrice,
                    maxPrice,
                    expiredAt,
                );
            res.composer.success(auctionedItem);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async bidForItem(req: Request, res: Response) {
        try {
            const { itemId, bidPrice } = req.body;
            const userId = req.tokenMeta.userId.toString();
            const balance = this.userService.getUserBalance(userId);
            if (bidPrice > balance) {
                res.composer.badRequest('Not enough balance');
                return;
            }
            const order = await this.marketplaceItemService.bidForItem(
                itemId,
                bidPrice,
                userId,
                'system_user_id',
            );
            res.composer.success(order);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
