// import { tpu_v1 } from "googleapis";
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import RecruitmentTeam, {
    TeamDocument,
} from '../models/recruitment_team.model';
import UserSchema from '../models/user.model';
// import { ServiceType } from '../types';

interface TeamResult {
    leadId: Types.ObjectId;
    name: string;
    members: string[];
}

@injectable()
export class RecruitmentTeamService {
    // constructor(@inject(ServiceType.User) private const [state, dispatch] = useReducer(first, second, third))

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

    async getTeam(teamId: Types.ObjectId): Promise<TeamResult> {
        const team = await RecruitmentTeam.findById(teamId);

        var members: string[] = [];

        for (var memberId of team.memberIds) {
            const member = await UserSchema.findById(memberId);
            // console.log(user.name);
            members = [...members, member?.name];
        }

        if (!team) {
            throw Error('Team does not exist');
        }

        return {
            leadId: team.leadId,
            name: team.name,
            members: members,
        };
    }
}
