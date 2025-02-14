import AxiosService from "../../Services/AxiosService.js";
import { CHAT_SERVICE_ENDPOINT } from "../../Utils/EnvStore.js";

const messageEndpoint = CHAT_SERVICE_ENDPOINT+"/message";

class MessageAPI {
    sendTextMessage(messageDto) {
        return AxiosService.post(messageEndpoint+"/text_message", messageDto);
    }

    reactMessage(reactionDto) {
        return AxiosService.put(`${messageEndpoint}/reaction`, reactionDto);
    }

    unsendMessage(messageId) {
        return AxiosService.put(`${messageEndpoint}/unsend/${messageId}`);
    }

    getPrivateMessages(receivedMessageNum, friendId){
        return AxiosService.get(`${messageEndpoint}/private`, {
            receivedMessageNum,
            friendId
        });
    }

    getTextChannelMessages(receivedMessageNum, channelId){
        return AxiosService.get(`${messageEndpoint}/text_channel`, {
            receivedMessageNum,
            channelId
        });
    }
}

export default new MessageAPI();