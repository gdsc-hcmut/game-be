import 'reflect-metadata';

import { App } from './app';
import container from './container';
import { SERVICE_PORT } from './config';
import { applyHttpResponseComposer } from './lib/response-composer';

import {
    AuthService,
    DatabaseService,
    UserService,
    GameService,
    ItemService,
    MarketplaceItemService,
    TransactionService,
    ClubDayService,
} from './services';
import {
    AuthController,
    UserController,
    GameController,
    ItemController,
    MarketplaceController,
    ClubDayController,
} from './controllers';
import { ServiceType } from './types';

import { SocketService } from './server-events';

// Binding service
container
    .bind<AuthService>(ServiceType.Auth)
    .to(AuthService)
    .inSingletonScope();
container
    .bind<DatabaseService>(ServiceType.Database)
    .to(DatabaseService)
    .inSingletonScope();
container
    .bind<UserService>(ServiceType.User)
    .to(UserService)
    .inSingletonScope();
container
    .bind<GameService>(ServiceType.Game)
    .to(GameService)
    .inSingletonScope();
container
    .bind<ItemService>(ServiceType.Item)
    .to(ItemService)
    .inSingletonScope();
container
    .bind<MarketplaceItemService>(ServiceType.MarketplaceItem)
    .to(MarketplaceItemService)
    .inSingletonScope();
container
    .bind<TransactionService>(ServiceType.Transaction)
    .to(TransactionService)
    .inSingletonScope();
container
    .bind<SocketService>(ServiceType.Socket)
    .to(SocketService)
    .inSingletonScope();
container
    .bind<ClubDayService>(ServiceType.ClubDay)
    .to(ClubDayService)
    .inSingletonScope();
// Initialize service first
Promise.all([
    container.get<DatabaseService>(ServiceType.Database).initialize(),
]).then(() => {
    const app = new App(
        [
            container.resolve<AuthController>(AuthController),
            container.resolve<UserController>(UserController),
            container.resolve<GameController>(GameController),
            container.resolve<ItemController>(ItemController),
            container.resolve<MarketplaceController>(MarketplaceController),
            container.resolve<ClubDayController>(ClubDayController),
        ],
        SERVICE_PORT,
        [
            applyHttpResponseComposer,
            container.get<AuthService>(ServiceType.Auth).applyMiddleware(),
        ],
    );
    container.get<SocketService>(ServiceType.Socket).initialize(app.io);
    app.listen();
});
