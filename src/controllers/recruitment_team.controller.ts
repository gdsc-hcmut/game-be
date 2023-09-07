import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from './controller';

import { Request, Response, ServiceType } from '../types';
import { AuthService, RecruitmentTeamService } from '../services';
import _ from 'lodash';
import { USER_ROLES } from '../models/user.model';
import { Types } from 'mongoose';

@injectable()
export class RecruitmentTeamController extends Controller {
    public readonly router = Router();
    public readonly path = '/recruitment-team';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.RecruitmentTeam)
        private recruitmentService: RecruitmentTeamService,
    ) {
        super();

        this.router.all('*', this.authService.authenticate());
        this.router.post('/', this.createNewTeam.bind(this));
        this.router.post('/delete', this.deleteTeam.bind(this));
        this.router.get('/', this.getTeamInfo.bind(this));
    }

    async createNewTeam(req: Request, res: Response) {
        try {
            if (
                !_.includes(
                    req.tokenMeta.roles,
                    USER_ROLES.STAFF_CLUBDAY_VERIFY,
                )
            ) {
                throw Error('You are not Staff of Club Day');
            }

            const leadId = new Types.ObjectId(req.body.leadId);
            var memberIds: Types.ObjectId[] = [];
            var newId: Types.ObjectId;
            for (const memberId of req.body.memberIds) {
                newId = new Types.ObjectId(memberId);
                memberIds = [...memberIds, newId];
                console.log(newId);
            }

            const name = req.body.name;

            const newTeam = await this.recruitmentService.createNewTeam(
                name,
                memberIds,
                leadId,
            );

            res.composer.success(newTeam);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async deleteTeam(req: Request, res: Response) {
        try {
            if (
                !_.includes(
                    req.tokenMeta.roles,
                    USER_ROLES.STAFF_CLUBDAY_VERIFY,
                )
            ) {
                throw Error('You are not Staff of Club Day');
            }

            const { name } = req.body;
            const deleteTeam = await this.recruitmentService.deleteTeam(name);

            res.composer.success(deleteTeam);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async getTeamInfo(req: Request, res: Response) {
        try {
            if (
                !_.includes(
                    req.tokenMeta.roles,
                    USER_ROLES.STAFF_CLUBDAY_VERIFY,
                )
            ) {
                throw Error('You are not Staff of Club Day');
            }

            const { name } = req.body;

            const team = await this.recruitmentService.getTeam(name);

            res.composer.success(team);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
