import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { Controller } from './controller';
import { AuthService, MobileDeviceService } from '../services';
import { Request, Response, ServiceType } from '../types';

@injectable()
export class MobileDeviceController extends Controller {
    public readonly router = Router();
    public readonly path = '/device';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.MobileDevice)
        private deviceService: MobileDeviceService,
    ) {
        super();

        this.router.all('*', this.authService.authenticate(true));
        this.router.post('/register', this.registerDevice.bind(this));
    }

    async registerDevice(req: Request, res: Response) {
        try {
            const { token: deviceToken } = req.body;
            const { userId } = req.tokenMeta;

            const deviceDoc = await this.deviceService.registerDeviceToken(
                userId,
                deviceToken,
            );

            res.composer.success({ deviceDoc });
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
}
