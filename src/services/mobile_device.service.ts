import { injectable } from 'inversify';
import _ from 'lodash';

import MobileDevice from '../models/mobile_device.model';
import { Types } from 'mongoose';

@injectable()
export class MobileDeviceService {
    constructor() {}

    async registerDeviceToken(userId: string, deviceToken: string) {
        const objUserId = new Types.ObjectId(userId);

        let deviceDoc = await MobileDevice.findOne({
            userId: objUserId,
            deviceToken,
        });

        if (!deviceDoc) {
            deviceDoc = await MobileDevice.create({
                objUserId,
                deviceToken,
            });
        } else {
            deviceDoc.isActive = true;
            await deviceDoc.save();
        }

        return deviceDoc;
    }

    async deactivateDeviceToken(userId: string, deviceToken: string) {
        const objUserId = new Types.ObjectId(userId);

        let deviceDoc = await MobileDevice.findOne({
            userId: objUserId,
            deviceToken,
        });

        if (deviceDoc) {
            deviceDoc.isActive = false;
            await deviceDoc.save();
        }

        return deviceDoc;
    }
}
