import { CHAT_SERVICE_ENDPOINT } from "../../Configs/EnvConfig.js";
import AxiosService from "../../Services/AxiosService.js";

const votingEndpoint= CHAT_SERVICE_ENDPOINT+"/voting"
class VotingAPI {
          createVoting(messageDto){
                    return AxiosService.post(votingEndpoint, messageDto);
          }

          chooseOption(optionDto){
                    return AxiosService.post(`${votingEndpoint}/choose-option`, optionDto);
          }

          blockVoting(messageId, nickName){
                    return AxiosService.post(`${votingEndpoint}/block/${messageId}`,null,{ nickName })
          }
}

export default new VotingAPI();