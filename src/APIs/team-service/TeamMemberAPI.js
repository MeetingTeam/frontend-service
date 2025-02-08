import AxiosService from "../../Services/AxiosService.js";
import { TEAM_SERVICE_ENDPOINT } from "../../Utils/EnvStore.js";

const teamMemberEndpoint = TEAM_SERVICE_ENDPOINT+"/team-member";

class TeamMemberAPI {
    addFriendsToTeam(addFriendsDto) {
        return AxiosService.post(`${teamMemberEndpoint}/add-friends`, addFriendsDto);
    }

    leaveTeam(teamId) {
        return AxiosService.delete(`${teamMemberEndpoint}/leave-team/${teamId}`);
    }

    kickMember(teamId, memberId) {
        return AxiosService.delete(`${teamMemberEndpoint}/kick-member`, {
            params: { teamId, memberId }
        });
    }

    getMembersOfTeam(teamId) {
        return AxiosService.get(`${teamMemberEndpoint}/${teamId}`);
    }
}

export default new TeamMemberAPI();