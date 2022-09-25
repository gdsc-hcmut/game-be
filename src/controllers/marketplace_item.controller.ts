import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { AuthService, ItemService, MarketplaceItemService } from '../services';
import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';

@injectable()
export class MarketplaceController extends Controller {
    public readonly router = Router();
    public readonly path = '/marketplace';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Item) private itemService: ItemService,
        @inject(ServiceType.MarketplaceItem)
        private marketplaceItemService: MarketplaceItemService,
    ) {
        super();

        // Configuring child routes

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());
        this.router.post('/private/items', this.aunctionNewItem.bind(this));
    }

    async aunctionNewItem(req: Request, res: Response) {
        try {
            const auctionedItem =
                await this.marketplaceItemService.auctionNewItem(
                    req.tokenMeta.userId.toString(),
                );
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
