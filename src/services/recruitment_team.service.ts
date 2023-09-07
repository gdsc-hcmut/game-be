// import { tpu_v1 } from "googleapis";
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import RecruitmentTeam, {
    TeamDocument,
} from '../models/recruitment_team.model';

@injectable()
export class RecruitmentTeamService {
    async createNewTeam(
        name: string,
        memberIds: Types.ObjectId[],
        leadId: Types.ObjectId,
    ): Promise<TeamDocument> {
        const checkExistTeam = await RecruitmentTeam.findOne({ name: name });

        if (checkExistTeam) {
            throw Error('This name has been used');
        }

        const newTeam = new RecruitmentTeam({
            name: name,
            memberIds: memberIds,
            leadId: leadId,
        });

        await newTeam.save();

        return newTeam;
    }

    async deleteTeam(name: string): Promise<TeamDocument> {
        const removedTeam = await RecruitmentTeam.findOneAndDelete({
            name: name,
        });

        if (!removedTeam) {
            throw Error('Team does not exist');
        }

        return removedTeam;
    }

    async getTeam(name: string): Promise<TeamDocument> {
        const team = await RecruitmentTeam.findOne({ name: name });

        if (!team) {
            throw Error('Team does not exist');
        }

        return team;
    }
}
