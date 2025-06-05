import { TEAM_SERVICE_ENDPOINT } from "../../Configs/EnvConfig.js";
import AxiosService from "../../Services/AxiosService.js";

const channelEndpoint = TEAM_SERVICE_ENDPOINT+"/channel";

class ChannelAPI {
    createChannel(channelDto) {
        return AxiosService.post(channelEndpoint, channelDto);
    }

    updateChannel(channelDto) {
        return AxiosService.patch(channelEndpoint, channelDto);
    }

    deleteChannel(channelId) {
        return AxiosService.delete(`${channelEndpoint}/${channelId}`);
    }
}

export default new ChannelAPI();
