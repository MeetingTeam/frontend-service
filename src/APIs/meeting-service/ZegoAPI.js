import AxiosService from "../../Util/AxiosService.js";
import { MEETING_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";

const zegoEndpoint= MEETING_SERVICE_ENDPOINT+"/zegocloud";
class ZegoAPI {
          generateZegoToken(meetingId){
                    return AxiosService.get(`${zegoEndpoint}/token`, {meetingId});
          }
}

export default new ZegoAPI();