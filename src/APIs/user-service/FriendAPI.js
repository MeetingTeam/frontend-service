import { USER_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";

const friendEndpoint= USER_SERVICE_ENDPOINT+"/friend";
class FriendAPI {
          getFriends() {
              return AxiosService.get(friendEndpoint);
          }
      
          unfriend(friendId) {
              return AxiosService.delete(`${friendEndpoint}/unfriend/${friendId}`);
          }
}
      
export default new FriendAPI();