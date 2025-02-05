import { CHAT_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";
import AxiosService from "./AxiosService";

const messageEndpoint = CHAT_SERVICE_ENDPOINT+"/message";

class MessageAPI {
    receiveMessage(messageDto) {
        return AxiosService.post(messageEndpoint, messageDto);
    }

    reactMessage(reactionDto) {
        return AxiosService.put(`${messageEndpoint}/reaction`, reactionDto);
    }

    unsendMessage(messageId) {
        return AxiosService.put(`${messageEndpoint}/unsend/${messageId}`);
    }
}

export default new MessageAPI();