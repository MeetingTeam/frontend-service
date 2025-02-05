import AxiosService from "../../Util/AxiosService.js";
import { CHAT_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";

const votingEndpoint= CHAT_SERVICE_ENDPOINT+"/voting"
class VotingAPI {
          chooseOption(optionDto){
                    return AxiosService.post(`${votingEndpoint}/choose-option`, optionDto);
          }

          blockVoting(messageId, nickName){
                    return AxiosService.post(`${votingEndpoint}/block/${messageId}`,null,{ nickName })
          }
}

export default new VotingAPI();