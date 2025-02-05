import { TEAM_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";
import AxiosService from "./AxiosService";

const teamEndpoint = TEAM_SERVICE_ENDPOINT+"/team";

class TeamAPI {
    createTeam(teamDto) {
        return AxiosService.post(teamEndpoint, teamDto);
    }

    updateTeam(teamDto) {
        return AxiosService.patch(teamEndpoint, teamDto);
    }

    getJoinedTeams() {
        return AxiosService.get(teamEndpoint);
    }
}

export default new TeamAPI();
