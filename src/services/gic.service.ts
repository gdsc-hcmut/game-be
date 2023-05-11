import { injectable, inject } from 'inversify';
import _ from 'lodash';
import { Types } from 'mongoose';
import { ServiceType } from '../types';
import { FileUploadService } from './file-upload.service';
import { FileCompressionStrategy } from '../lib/file-compression/strategies';
import GICContestRegModel, { ContestRegStatus } from '../models/gic/contest-registration.model';

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
        return (await this.findContestRegistrationRecord(userId))
            .filter(c => c.status === ContestRegStatus.REGISTERED)
            .length > 0
    }
    
    async findOneContestRegAndUpdate(x: any, y: any) {
        return GICContestRegModel.findOneAndUpdate(x, y)
    }
}