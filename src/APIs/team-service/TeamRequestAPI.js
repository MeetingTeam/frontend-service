import { TEAM_SERVICE_ENDPOINT } from "../../Configs/EnvConfig.js";
import AxiosService from "../../Services/AxiosService.js";

const teamRequestEndpoint = TEAM_SERVICE_ENDPOINT+"/team-request";

class TeamRequestAPI {
    createTeamRequest(requestDto) {
        return AxiosService.post(teamRequestEndpoint, requestDto);
    }

    acceptNewMember(acceptDto) {
        return AxiosService.post(`${teamRequestEndpoint}/accept`, acceptDto);
    }

    getTeamRequests(teamId) {
        return AxiosService.get(`${teamRequestEndpoint}/team/${teamId}`);
    }

    getSendedRequests() {
        return AxiosService.get(teamRequestEndpoint);
    }

    deleteTeamRequest(requestId) {
        return AxiosService.delete(`${teamRequestEndpoint}/${requestId}`);
    }
}

export default new TeamRequestAPI();