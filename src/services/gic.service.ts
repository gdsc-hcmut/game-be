import { injectable, inject } from 'inversify';
import _ from 'lodash';
import { Types } from 'mongoose';
import { ServiceType } from '../types';
import { FileUploadService } from './file-upload.service';
import { FileCompressionStrategy } from '../lib/file-compression/strategies';
import GICContestRegModel from '../models/gic/contest-registration.model';

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
            members: data
        })
    }
}