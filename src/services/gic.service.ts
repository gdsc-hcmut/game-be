import { injectable, inject } from 'inversify';
import _ from 'lodash';
import { Types } from 'mongoose';
import { ServiceType } from '../types';
import { FileUploadService } from './file-upload.service';
import { FileCompressionStrategy } from '../lib/file-compression/strategies';
import GICContestRegModel, { ContestRegStatus } from '../models/gic/contest-registration.model';
import DayRegModel, { DayRegStatus } from '../models/gic/day-registration.model';

@injectable()
export class GICService {
    constructor(
        @inject(ServiceType.FileUpload) private fileUploadService: FileUploadService
    ) {
    }
    
    async registerContest(
        userId: Types.ObjectId,
        data: any[],
        files: Express.Multer.File[],
        compresionStrategy: FileCompressionStrategy
    ) {
        const uploadedFiles = await this.fileUploadService.uploadFiles(
            files,
            compresionStrategy
        )
        const currentTime = Date.now();
        
        return await GICContestRegModel.create({
            registeredBy: userId,
            registeredAt: currentTime,
            status: ContestRegStatus.REGISTERED,
            members: data
        })
    }
    
    async findContestRegistrationRecord(userId: Types.ObjectId) {
        return GICContestRegModel.find({ registeredBy: userId })
    }
    
    async userHasRegisteredContest(userId: Types.ObjectId) {
        return await GICContestRegModel.findOne({
            registeredBy: userId,
            status: ContestRegStatus.REGISTERED
        }) != null
    }
    
    async findOneContestRegAndUpdate(x: any, y: any) {
        return GICContestRegModel.findOneAndUpdate(x, y)
    }
    
    async findDayRegistrationRecord(userId: Types.ObjectId) {
        return DayRegModel.find({ registeredBy: userId })
    }
    
    async userHasRegisteredDay(userId: Types.ObjectId, day: number) {
        return await DayRegModel.findOne({
            registeredBy: userId,
            day: day,
            status: DayRegStatus.REGISTERED
        }) != null
    }
}