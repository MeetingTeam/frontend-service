import { MEETING_SERVICE_ENDPOINT } from "../../Configs/EnvConfig.js";
import AxiosService from "../../Services/AxiosService.js";

const zegoEndpoint= MEETING_SERVICE_ENDPOINT+"/zegocloud";
class ZegoAPI {
          generateZegoToken(meetingId){
                    return AxiosService.get(`${zegoEndpoint}/token`, {meetingId});
          }
}

export default new ZegoAPI();