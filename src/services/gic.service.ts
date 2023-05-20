import { injectable, inject } from 'inversify';
import _ from 'lodash';
import { Types } from 'mongoose';
import { ServiceType } from '../types';
import { FileUploadService } from './file-upload.service';
import { FileCompressionStrategy } from '../lib/file-compression/strategies';
import GICContestRegModel, {
    ContestRegStatus,
} from '../models/gic/contest-registration.model';
import DayRegModel, {
    DayRegStatus,
} from '../models/gic/day-registration.model';
import { ItemService } from './item.service';

@injectable()
export class GICService {
    constructor(
        @inject(ServiceType.FileUpload)
        private fileUploadService: FileUploadService,
        @inject(ServiceType.Item) private itemService: ItemService,
    ) {}

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

    async findContestRegistrationRecord(userId: Types.ObjectId) {
        return GICContestRegModel.find({ registeredBy: userId });
    }
    
    async findcCurrentContestRegistration(userId: Types.ObjectId) {
        return GICContestRegModel.findOne({ registeredBy: userId, status: ContestRegStatus.REGISTERED })
    }

    async userHasRegisteredContest(userId: Types.ObjectId) {
        return (
            (await GICContestRegModel.findOne({
                registeredBy: userId,
                status: ContestRegStatus.REGISTERED,
            })) != null
        );
    }
    
    async findContestRegById(id: Types.ObjectId) {
        return await GICContestRegModel.findById(id)
    }

    async findOneContestRegAndUpdate(x: any, y: any) {
        return GICContestRegModel.findOneAndUpdate(x, y);
    }

    async registerDay(userId: Types.ObjectId, day: number) {
        return await DayRegModel.create({
            registeredBy: userId,
            registeredAt: Date.now(),
            day: day,
            status: DayRegStatus.REGISTERED,
        });
    }

    async findDayRegistrationRecord(userId: Types.ObjectId) {
        return DayRegModel.find({ registeredBy: userId });
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

    async findOneDayRegAndUpdate(x: any, y: any) {
        return DayRegModel.findOneAndUpdate(x, y);
    }
    
    async findDayRegById(id: Types.ObjectId) {
        return await DayRegModel.findById(id)
    }
}
