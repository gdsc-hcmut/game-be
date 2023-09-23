// import { tpu_v1 } from "googleapis";
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import RecruitmentTeam, {
    TeamDocument,
} from '../models/recruitment_team.model';
// import { ServiceType } from '../types';

interface Team {
    name: string;
    members: string[];
}

@injectable()
export class RecruitmentTeamService {
    // constructor(@inject(ServiceType.User) private const [state, dispatch] = useReducer(first, second, third))

    async createNewTeam(
        name: string,
        members: string[],
    ): Promise<TeamDocument> {
        const checkExistTeam = await RecruitmentTeam.findOne({ name: name });

        if (checkExistTeam) {
            throw Error('This name has been used');
        }

        const newTeam = new RecruitmentTeam({
            name: name,
            members: members,
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

    async getTeam(teamId: Types.ObjectId): Promise<Team> {
        const team = await RecruitmentTeam.findById(teamId);

        if (!team) {
            throw Error('Team does not exist');
        }

        return {
            name: team.name,
            members: team.members,
        };
    }

    async submitMiniGame(
        teamId: Types.ObjectId,
        map: Array<Array<string>>,
    ): Promise<Team> {
        const team = await RecruitmentTeam.findById(teamId);

        if (!team) {
            throw Error('Team does not exist');
        }

        team.miniGameMap = map;
        await team.save();

        return team;
    }
}
