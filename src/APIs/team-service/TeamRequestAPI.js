import { TEAM_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";
import AxiosService from "./AxiosService";

const teamRequestEndpoint = TEAM_SERVICE_ENDPOINT+"/team-request";

class TeamRequestAPI {
    createTeamRequest(requestDto) {
        return AxiosService.post(teamRequestEndpoint, requestDto);
    }

    acceptNewMember(acceptDto) {
        return AxiosService.post(`${teamRequestEndpoint}/accept`, acceptDto);
    }

    getTeamRequestMessages(teamId) {
        return AxiosService.get(`${teamRequestEndpoint}/team/${teamId}`);
    }

    getSendedRequestMessages() {
        return AxiosService.get(teamRequestEndpoint);
    }

    deleteTeamRequest(requestId) {
        return AxiosService.delete(`${teamRequestEndpoint}/${requestId}`);
    }
}

export default new TeamRequestAPI();