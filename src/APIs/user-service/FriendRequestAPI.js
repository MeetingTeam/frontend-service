import { USER_SERVICE_ENDPOINT } from "../../Configs/EnvConfig.js";
import AxiosService from "../../Services/AxiosService.js";

const friendRequestEndpoint = USER_SERVICE_ENDPOINT+"/friend-request";

class FriendRequestAPI {
    createFriendRequest(requestDto) {
        return AxiosService.post(friendRequestEndpoint, requestDto);
    }

    acceptFriend(requestId, isAccepted) {
          return AxiosService.post(`${friendRequestEndpoint}/accept/${requestId}`, 
                    null, { isAccepted }
          );
    }

    deleteFriendRequest(requestId) {
        return AxiosService.delete(`${friendRequestEndpoint}/${requestId}`);
    }

    getReceivedRequests() {
        return AxiosService.get(`${friendRequestEndpoint}/received-requests`);
    }

    getSentRequests() {
        return AxiosService.get(`${friendRequestEndpoint}/sent-requests`);
    }
}

export default new FriendRequestAPI();