import { CHAT_SERVICE_ENDPOINT } from "../../Configs/EnvConfig.js";
import AxiosService from "../../Services/AxiosService.js";

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

    getFriendMessages(receivedMessageNum, friendId){
        return AxiosService.get(`${messageEndpoint}/friend/${friendId}`, {
            receivedMessageNum
        });
    }

    getTextChannelMessages(receivedMessageNum, channelId){
        return AxiosService.get(`${messageEndpoint}/text_channel/${channelId}`, {
            receivedMessageNum
        });
    }
}

export default new MessageAPI();