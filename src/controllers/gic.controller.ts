import { injectable, inject } from "inversify";
import { Controller } from "./controller";
import { Router } from "express";
import { Request, Response, ServiceType } from "../types";
import { AuthService, UserService } from "../services";
import { fileUploader } from "../upload-storage";
import { Types } from "mongoose";
import { GICService } from "../services/gic.service";
import { NoFileCompression } from "../lib/file-compression/strategies";
import { ContestRegStatus } from "../models/gic/contest-registration.model";
import { DayRegStatus } from "../models/gic/day-registration.model";
import { UploadValidator } from "../lib/upload-validator/upload-validator"
import { UploadIdeaDescriptionValidation } from "../lib/upload-validator/upload-validator-strategies";
import { MailService } from "../services/mail.service";
import { contestRegistrationMail } from "../constant";
import { USER_ROLES } from "../models/user.model";
import { FileUploadService } from "../services/file-upload.service";

@injectable()
export class GICController extends Controller {
    public readonly router = Router();
    public readonly path = '/gic';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.GIC) private gicService: GICService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Mail) private mailService: MailService,
        @inject(ServiceType.FileUpload) private fileUploadService: FileUploadService
    ) {
        super();
        
        this.router.post(
            `/contest/register`,
            authService.authenticate(),
            fileUploader.any(),
            this.registerContest.bind(this)
        )
        this.router.post(
            `/contest/unregister/:registrationId`,
            authService.authenticate(),
            this.unregisterContest.bind(this)
        )
        this.router.get(`/contest/myregistration`, this.getRegisteredContest.bind(this))
        this.router.get(`/contest/get/:registrationId`, this.getIdeaById.bind(this))
        this.router.get(`/contest/download/:registrationId`, this.downloadIdeaDescription.bind(this))

        this.router.post("/day/register/:day", this.registerDay.bind(this))
        this.router.post("/day/unregister/:day", this.unregisterDay.bind(this))
        this.router.get(`/day/myregistration`, this.getRegisteredDay.bind(this))
        this.router.get(`/day/get/:registrationId`, this.getDayRegistrationById.bind(this))
    }
    
    // API'S FOR CONTEST
    
    async registerContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const members = JSON.parse(req.body.members)
            const { ideaName } = req.body
            if (!ideaName) {
                throw new Error(`Idea name is missing`)
            }
            if (!members) {
                throw new Error(`Missing members field`)
            }
            if (members.length > 3) {
                throw new Error(`A team can consist of at most 3 people`)
            }
            
            for (const [i, mem] of members.entries()) {
                if (!mem[`name`]) throw new Error(`Member ${i + 1} missing fullname`)
                if (!mem[`email`]) throw new Error(`Member ${i + 1} missing email`)
                if (!mem[`school`]) throw new Error(`Member ${i + 1} missing school`)
                if (!mem[`major`]) throw new Error(`Member ${i + 1} missing major`)
            }
            
            new UploadValidator(new UploadIdeaDescriptionValidation()).validate(req.files as Express.Multer.File[])

            const result = await this.gicService.registerContest(
                userId,
                ideaName,
                members,
                req.files as Express.Multer.File[],
                new NoFileCompression()
            )
            
            // send confirmation email
            const user = await this.userService.findById(userId)
            // this.mailService.sendToOne(
            //     user.email,
            //     "[GDSC Idea Contest] Idea Registration Successful",
            //     contestRegistrationMail(user.name)
            // )

            res.composer.success(result)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async unregisterContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const regId = new Types.ObjectId(req.params.registrationId)
            const reg = await this.gicService.findOneContestRegAndUpdate(
                { _id: regId, registeredBy: userId, status: ContestRegStatus.REGISTERED },
                { status: ContestRegStatus.CANCELLED }
            )
            if (!reg) {
                throw new Error(`Registration not found`)
            } else {
                res.composer.success(`Successfully cancelled registration`)
            }
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async getRegisteredContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            
            const ans = (await this.gicService.findContestRegistrationRecord(userId))
                .filter(c => c.status === ContestRegStatus.REGISTERED)
            
            res.composer.success(ans)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async getIdeaById(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const userRoles = req.tokenMeta.roles
            const regId = new Types.ObjectId(req.params.registrationId)
            
            const reg = await this.gicService.findContestRegById(regId)
            if (!reg) {
                throw new Error(`Contest registration not found`)
            }
            if (
                !userId.equals(reg.registeredBy) &&
                !userRoles.includes(USER_ROLES.SYSTEM) &&
                !userRoles.includes(USER_ROLES.SUPER_ADMIN)
            ) {
                throw new Error(`You don't have permission to view this`)
            }
            res.composer.success(reg)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async downloadIdeaDescription(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const userRoles = req.tokenMeta.roles
            const regId = new Types.ObjectId(req.params.registrationId)
            
            const reg = await this.gicService.findContestRegById(regId)
            if (!reg) {
                throw new Error(`Contest registration not found`)
            }
            if (
                !userId.equals(reg.registeredBy) &&
                !userRoles.includes(USER_ROLES.SYSTEM) &&
                !userRoles.includes(USER_ROLES.SUPER_ADMIN)
            ) {
                throw new Error(`You don't have permission to download this file`)
            }
            
            const file = await this.fileUploadService.downloadFile(reg.ideaDescription)
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${file.originalName}`
            );
            res.setHeader("Content-Type", `${file.mimetype}`);
            res.end(file.buffer);
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    // API'S FOR DAY
    
    async registerDay(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const day = parseInt(req.params.day)
            if (!(1 <= day && day <= 5)) {
                throw new Error(`Can only register for days 1 through 5`)
            }

            if (await this.gicService.userHasRegisteredDay(userId, day)) {
                throw new Error(`You have already registered for day ${day} of GIC`)
            }
            const result = await this.gicService.registerDay(userId, day)

            // send confirmation email
            const user = await this.userService.findById(userId)
            // this.mailService.sendToOne(
            //     user.email,
            //     "[GDSC Idea Contest] Event Registration Successful",
            //     contestRegistrationMail(user.name)
            // )

            res.composer.success(result)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async unregisterDay(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const day = parseInt(req.params.day)
            if (!(1 <= day && day <= 5)) {
                throw new Error(`Can only register for days 1 through 5`)
            }
            
            if (!(await this.gicService.userHasRegisteredDay(userId, day))) {
                throw new Error(`You aren't currently registered for day ${day} of GIC`)
            }
            const result = await this.gicService.findOneDayRegAndUpdate(
                { registeredBy: userId, status: DayRegStatus.REGISTERED },
                { status: DayRegStatus.CANCELLED }
            )
            res.composer.success(result)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async getRegisteredDay(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            
            const ans = (await this.gicService.findDayRegistrationRecord(userId))
                .filter(d => d.status === DayRegStatus.REGISTERED)
                
            res.composer.success(ans)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async getDayRegistrationById(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const userRoles = req.tokenMeta.roles
            const regId = new Types.ObjectId(req.params.registrationId)
            
            const reg = await this.gicService.findDayRegById(regId)
            if (!reg) {
                throw new Error(`Day registration not found`)
            }
            if (
                !userId.equals(reg.registeredBy) &&
                !userRoles.includes(USER_ROLES.SYSTEM) &&
                !userRoles.includes(USER_ROLES.SUPER_ADMIN)
            ) {
                throw new Error(`You don't have permission to view this`)
            }
            res.composer.success(reg)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
}
