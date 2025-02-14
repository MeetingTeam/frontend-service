import AxiosService from "../../Services/AxiosService.js";
import { TEAM_SERVICE_ENDPOINT } from "../../Utils/EnvStore.js";

const teamEndpoint = TEAM_SERVICE_ENDPOINT+"/team";

class TeamAPI {
    createTeam(teamDto) {
        return AxiosService.post(teamEndpoint, teamDto);
    }

    updateTeam(teamDto) {
        return AxiosService.patch(teamEndpoint, teamDto);
    }

    getJoinedTeams(pageNo, pageSize) {
        pageNo= Math.floor(pageNo);
        return AxiosService.get(teamEndpoint, {
            pageNo, 
            pageSize
        });
    }

    searchTeamsByName(searchName){
        return AxiosService.get(`${teamEndpoint}/search/${searchName}`);
    }

    deleteTeam(teamId){
        return AxiosService.delete(`${teamEndpoint}/${teamId}`);
    }
}

export default new TeamAPI();
