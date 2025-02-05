import { USER_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";
import AxiosService from "./AxiosService";

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
        return AxiosService.get(`${FRIEND_REQUEST_ENDPOINT}/sent-requests`);
    }
}

export default new FriendRequestAPI();