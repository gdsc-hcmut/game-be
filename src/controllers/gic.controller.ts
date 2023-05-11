import { injectable, inject } from "inversify";
import { Controller } from "./controller";
import { Router } from "express";
import { Request, Response, ServiceType } from "../types";
import { AuthService } from "../services";
import { fileUploader } from "../upload-storage";
import { Types } from "mongoose";
import { GICService } from "../services/gic.service";
import { NoFileCompression } from "../lib/file-compression/strategies";

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
            `/register/contest`,
            authService.authenticate(),
            fileUploader.any(),
            this.registerContest.bind(this)
        )
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
            
            const result = await this.gicService.registerContest(
                userId,
                members,
                req.files as Express.Multer.File[],
                new NoFileCompression()
            )
            res.composer.success(result)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async unregisterContest(req: Request, res: Response) {
    }
}
