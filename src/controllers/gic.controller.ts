import { injectable, inject } from "inversify";
import { Controller } from "./controller";
import { Router } from "express";
import { Request, Response, ServiceType } from "../types";
import { AuthService } from "../services";
import { fileUploader } from "../upload-storage";
import { Types } from "mongoose";
import { GICService } from "../services/gic.service";
import { NoFileCompression } from "../lib/file-compression/strategies";
import { ContestRegStatus } from "../models/gic/contest-registration.model";
import { sendToMany } from "../lib/mail";
import { HTML_TEMPLATE } from "../constant";

@injectable()
export class GICController extends Controller {
    public readonly router = Router();
    public readonly path = '/gic';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.GIC) private gicService: GICService,
    ) {
        super();
        
        this.router.post(
            `/contest/register`,
            authService.authenticate(),
            fileUploader.any(),
            this.registerContest.bind(this)
        )
        this.router.post(
            `/contest/unregister`,
            authService.authenticate(),
            this.unregisterContest.bind(this)
        )
        this.router.get(`/contest/myregistration`, this.getRegisteredContest.bind(this))
    }
    
    async registerContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            const { members } = req.body
            if (!members) {
                throw new Error(`Missing members field`)
            }
            if (members.length > 3) {
                throw new Error(`A team can consist of at most 3 people`)
            }
            
            for (const [i, mem] of members) {
                if (!mem[`name`]) throw new Error(`Member ${i + 1} missing fullname`)
                if (!mem[`email`]) throw new Error(`Member ${i + 1} missing email`)
                if (!mem[`school`]) throw new Error(`Member ${i + 1} missing school`)
                if (!mem[`major`]) throw new Error(`Member ${i + 1} missing major`)
            }
            
            if (!this.gicService.userHasRegisteredContest(userId)) {
                throw new Error(`User have already registered for a contest`)
            }
            const result = await this.gicService.registerContest(
                userId,
                members,
                req.files as Express.Multer.File[],
                new NoFileCompression()
            )
            
            // send confirmation email
            sendToMany(members.map((m: any) => ({
                email: m.email
            })), HTML_TEMPLATE())
            res.composer.success(result)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async unregisterContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId)
            if (!this.gicService.userHasRegisteredContest(userId)) {
                throw new Error(`You aren't registered for the contest`)
            }
            await this.gicService.findOneContestRegAndUpdate(
                { registeredBy: userId },
                { status: ContestRegStatus.CANCELLED }
            )
            res.composer.success(`Successfully unregistered from contest`)
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
            
            console.assert(ans.length <= 1)
            res.composer.success(ans.length === 0 ? {} : ans[0])
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
}
