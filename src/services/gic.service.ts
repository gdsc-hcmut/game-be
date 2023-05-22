import { injectable, inject } from 'inversify';
import _ from 'lodash';
import { Types } from 'mongoose';
import { ServiceType } from '../types';
import { FileUploadService } from './file-upload.service';
import { FileCompressionStrategy } from '../lib/file-compression/strategies';
import GICContestRegModel, {
    ContestRegStatus,
} from '../models/gic/contest_registration.model';
import DayRegModel, {
    DayRegStatus,
} from '../models/gic/day_registration.model';
import { ItemService } from './item.service';

@injectable()
export class GICService {
    constructor(
        @inject(ServiceType.FileUpload)
        private fileUploadService: FileUploadService,
        @inject(ServiceType.Item) private itemService: ItemService,
    ) { }

    // FOR CONTESTS

    async registerContest(
        userId: Types.ObjectId,
        ideaName: string,
        members: any[],
        files: Express.Multer.File[],
        compresionStrategy: FileCompressionStrategy,
    ) {
        const uploadedFiles = await this.fileUploadService.uploadFiles(
            files,
            compresionStrategy,
        );
        const currentTime = Date.now();

        return await GICContestRegModel.create({
            registeredBy: userId,
            registeredAt: currentTime,
            ideaDescription: uploadedFiles[0]._id,
            ideaName: ideaName,
            status: ContestRegStatus.REGISTERED,
            members: members,
        });
    }

    async findCurrentContestRegistration(userId: Types.ObjectId) {
        return await GICContestRegModel.findOne({ registeredBy: userId, status: ContestRegStatus.REGISTERED })
    }

    async userHasRegisteredContest(userId: Types.ObjectId) {
        return (
            (await GICContestRegModel.findOne({
                registeredBy: userId,
                status: ContestRegStatus.REGISTERED,
            })) != null
        );
    }

    async findOneContestRegAndUpdate(x: any, y: any) {
        return await GICContestRegModel.findOneAndUpdate(x, y);
    }

    // FOR DAY REGISTRATION

    async registerDay(userId: Types.ObjectId, day: number, inviteId: Types.ObjectId = undefined) {
        return await DayRegModel.create({
            registeredBy: userId,
            registeredAt: Date.now(),
            day: day,
            status: DayRegStatus.REGISTERED,
            invitedBy: inviteId
        });
    }

    async findDayRegistrations(x: any) {
        return await DayRegModel.find(x);
    }

    async userHasRegisteredDay(userId: Types.ObjectId, day: number) {
        return (
            (await DayRegModel.findOne({
                registeredBy: userId,
                day: day,
                status: DayRegStatus.REGISTERED,
            })) != null
        );
    }

    async userHasCheckinDay(userId: Types.ObjectId, day: number) {
        return (
            (await DayRegModel.findOne({
                registeredBy: userId,
                day: day,
                status: DayRegStatus.CHECKIN,
            })) != null
        );
    }

    async findOneDayRegAndUpdate(x: any, y: any) {
        return await DayRegModel.findOneAndUpdate(x, y);
    }

    async findDayRegById(id: Types.ObjectId) {
        return await DayRegModel.findById(id)
    }
}
