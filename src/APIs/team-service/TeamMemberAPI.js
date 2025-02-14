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
        console.log("kickMmeber", teamId, memberId);
        return AxiosService.delete(`${teamMemberEndpoint}/kick-member`, {
            teamId: teamId, 
            memberId: memberId
        });
    }

    getMembersOfTeam(teamId) {
        return AxiosService.get(`${teamMemberEndpoint}/${teamId}`);
    }
}

export default new TeamMemberAPI();