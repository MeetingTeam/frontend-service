import AxiosService from "../../Services/AxiosService.js";
import { MEETING_SERVICE_ENDPOINT } from "../../Utils/EnvStore.js";

const zegoEndpoint= MEETING_SERVICE_ENDPOINT+"/zegocloud";
class ZegoAPI {
          generateZegoToken(meetingId){
                    return AxiosService.get(`${zegoEndpoint}/token`, {meetingId});
          }
}

export default new ZegoAPI();