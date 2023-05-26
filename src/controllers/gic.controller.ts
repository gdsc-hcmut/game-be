import { injectable, inject } from 'inversify';
import { Controller } from './controller';
import { Router } from 'express';
import { Request, Response, ServiceType } from '../types';
import { AuthService, UserService } from '../services';
import { fileUploader } from '../upload-storage';
import { Types } from 'mongoose';
import { GICService } from '../services/gic/gic.service';
import { NoFileCompression } from '../lib/file-compression/strategies';
import { ContestRegStatus } from '../models/gic/contest_registration.model';
import DayRegModel, {
    DayRegDocument,
    DayRegStatus,
} from '../models/gic/day_registration.model';
import { UploadValidator } from '../lib/upload-validator/upload-validator';
import { UploadIdeaDescriptionValidation } from '../lib/upload-validator/upload-validator-strategies';
import { MailService } from '../services/mail.service';
import { USER_ROLES } from '../models/user.model';
import { FileUploadService } from '../services/file-upload.service';
import { PassThrough } from 'stream';
import QRCode from 'qrcode';
import {
    CONTEST_REGISTRATION_SUCCESSFUL_EMAIL,
    DAY_1_4_REGISTRATION_SUCCESSFUL_EMAIL,
    DAY_5_REGISTRATION_SUCCESSFUL_EMAIL,
} from '../constant';

@injectable()
export class GICController extends Controller {
    public readonly router = Router();
    public readonly path = '/gic';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.GIC) private gicService: GICService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Mail) private mailService: MailService,
        @inject(ServiceType.FileUpload)
        private fileUploadService: FileUploadService,
    ) {
        super();

        this.router.get(`/qr/:content`, this.getQrCode.bind(this));

        this.router.all('*', this.authService.authenticate(false));
        this.router.post(
            `/contest/register`,
            authService.authenticate(),
            fileUploader.any(),
            this.registerContest.bind(this),
        );
        this.router.post(
            `/contest/unregister`,
            authService.authenticate(),
            this.unregisterContest.bind(this),
        );
        this.router.get(
            `/contest/myregistration`,
            this.getRegisteredContest.bind(this),
        );
        this.router.get(
            `/contest/download`,
            this.downloadIdeaDescription.bind(this),
        );

        this.router.post('/day/register/:day', this.registerDay.bind(this));
        this.router.post('/day/unregister/:day', this.unregisterDay.bind(this));
        this.router.get(
            `/day/myregistration`,
            this.getRegisteredDays.bind(this),
        );
        this.router.get(
            `/day/get/:registrationId`,
            this.getDayRegistrationById.bind(this),
        );
        this.router.get(
            `/day/invitedbyme`,
            this.getPeopleUserInvited.bind(this),
        );
    }

    async getQrCode(req: Request, res: Response) {
        try {
            const content = req.params.content;
            const qrStream = new PassThrough();
            const result = await QRCode.toFileStream(qrStream, content, {
                type: 'png',
                width: 400,
                margin: 0,
                errorCorrectionLevel: 'H',
            });
            qrStream.pipe(res);
        } catch (err) {
            console.log(err);
        }
    }
    // API'S FOR CONTEST

    async registerContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const user = await this.userService.findById(userId);
            const members = JSON.parse(req.body.members) as any[];
            const { ideaName } = req.body;
            if (!ideaName) {
                throw new Error(`Idea name is missing`);
            }
            if (!members) {
                throw new Error(`Missing members field`);
            }
            if (members.length > 3) {
                throw new Error(`A team can consist of at most 3 people`);
            }

            let leaderPresent = false;
            for (const [i, mem] of members.entries()) {
                if (!mem[`name`])
                    throw new Error(`Member ${i + 1} missing fullname`);
                if (!mem[`email`])
                    throw new Error(`Member ${i + 1} missing email`);
                if (!mem[`school`])
                    throw new Error(`Member ${i + 1} missing school`);
                if (!mem[`major`])
                    throw new Error(`Member ${i + 1} missing major`);
                mem[`confirmed`] = false;
                leaderPresent = leaderPresent || mem[`email`] === user.email;
            }
            if (!leaderPresent) {
                throw new Error(`Team doesn't contain yourself`);
            }

            new UploadValidator(new UploadIdeaDescriptionValidation()).validate(
                req.files as Express.Multer.File[],
            );

            if (await this.gicService.userHasRegisteredContest(userId)) {
                throw new Error(
                    `You have already already registered your idea`,
                );
            }

            const result = await this.gicService.registerContest(
                userId,
                ideaName,
                members,
                req.files as Express.Multer.File[],
                new NoFileCompression(),
            );

            // TODO: send confirmation email, different for the person who registered and others
            members.forEach((m) =>
                this.mailService.sendToOne(
                    m.email,
                    '[GDSC Idea Contest 2023] Confirm Contest Registration',
                    CONTEST_REGISTRATION_SUCCESSFUL_EMAIL(m.name, ideaName),
                ),
            );

            res.composer.success(result);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async unregisterContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const reg = await this.gicService.findOneContestRegAndUpdate(
                { registeredBy: userId, status: ContestRegStatus.REGISTERED },
                { status: ContestRegStatus.CANCELLED },
            );
            if (!reg) {
                throw new Error(`Registration not found`);
            }
            res.composer.success(reg);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getRegisteredContest(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);

            const ans = await this.gicService.findCurrentContestRegistration(
                userId,
            );
            res.composer.success(!ans ? {} : ans);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async downloadIdeaDescription(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);

            const reg = await this.gicService.findCurrentContestRegistration(
                userId,
            );
            if (!reg) {
                throw new Error(`Contest registration not found`);
            }

            const file = await this.fileUploadService.downloadFile(
                reg.ideaDescription,
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=${file.originalName}`,
            );
            res.setHeader('Content-Type', `${file.mimetype}`);
            res.end(file.buffer);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    // API'S FOR DAY

    async registerDay(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const day = parseInt(req.params.day);
            if (!(1 <= day && day <= 5)) {
                throw new Error(`Can only register for days 1 through 5`);
            }

            if (await this.gicService.userHasRegisteredDay(userId, day)) {
                throw new Error(
                    `You have already registered for day ${day} of GIC`,
                );
            }

            if (await this.gicService.userHasCheckinDay(userId, day)) {
                throw new Error(
                    `You have checked in to day ${day} of GIC already`,
                );
            }

            const inviteIdString = req.query.inviteId as string;
            if (day != 5 && inviteIdString) {
                throw new Error(
                    `An invite code can only be used on day 5 of GIC`,
                );
            }

            let result;
            if (inviteIdString) {
                const inviteId = new Types.ObjectId(inviteIdString);
                if (!(await this.userService.findById(inviteId))) {
                    throw new Error(`Invite code invalid`);
                }
                result = await this.gicService.registerDay(
                    userId,
                    day,
                    inviteId,
                );
            } else {
                result = await this.gicService.registerDay(userId, day);
            }

            // send confirmation email
            const user = await this.userService.findById(userId);
            this.mailService.sendToOne(
                user.email,
                `[GDSC Idea Contest 2023] Event Day ${day} Registration Successful`,
                day != 5
                    ? DAY_1_4_REGISTRATION_SUCCESSFUL_EMAIL(
                          user.name,
                          result._id,
                      )
                    : DAY_5_REGISTRATION_SUCCESSFUL_EMAIL(
                          user.name,
                          result._id,
                      ),
            );

            res.composer.success(result);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async unregisterDay(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const day = parseInt(req.params.day);
            if (!(1 <= day && day <= 5)) {
                throw new Error(`Can only register for days 1 through 5`);
            }

            if (!(await this.gicService.userHasRegisteredDay(userId, day))) {
                throw new Error(
                    `You aren't currently registered for day ${day} of GIC`,
                );
            }
            if (await this.gicService.userHasCheckinDay(userId, day)) {
                throw new Error(
                    `You have checked in to day ${day} of GIC already`,
                );
            }
            const result = await this.gicService.findOneDayRegAndUpdate(
                { registeredBy: userId, status: DayRegStatus.REGISTERED },
                { status: DayRegStatus.CANCELLED },
            );
            res.composer.success(result);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getRegisteredDays(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);

            const ans = await Promise.all(
                (
                    await this.gicService.findDayRegistrations({
                        registeredBy: userId,
                    })
                )
                    .filter(
                        (d) =>
                            d.status === DayRegStatus.REGISTERED ||
                            d.status === DayRegStatus.CHECKIN,
                    )
                    .map((d) => (async () => await d.populate('invitedBy'))()),
            );

            res.composer.success(ans);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getDayRegistrationById(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const userRoles = req.tokenMeta.roles;
            const regId = new Types.ObjectId(req.params.registrationId);

            const reg = await this.gicService.findDayRegById(regId);
            if (!reg) {
                throw new Error(`Day registration not found`);
            }
            if (
                !userId.equals(reg.registeredBy) &&
                !userRoles.includes(USER_ROLES.SYSTEM) &&
                !userRoles.includes(USER_ROLES.SUPER_ADMIN)
            ) {
                throw new Error(`You don't have permission to view this`);
            }
            res.composer.success(reg);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getPeopleUserInvited(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.tokenMeta.userId);
            const ans = await Promise.all(
                (
                    await this.gicService.findDayRegistrations({
                        invitedBy: userId,
                        status: {
                            $in: [
                                DayRegStatus.REGISTERED,
                                DayRegStatus.CHECKIN,
                            ],
                        },
                    })
                ).map((d) => (async () => await d.populate('registeredBy'))()),
            );
            res.composer.success(ans);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error);
        }
    }
}
