import AxiosService from "../../Services/AxiosService.js";
import { USER_SERVICE_ENDPOINT } from "../../Utils/EnvStore.js";

const friendEndpoint= USER_SERVICE_ENDPOINT+"/friend";
class FriendAPI {
          getFriends() {
              return AxiosService.get(friendEndpoint);
          }

          searchFriendsByName(searchName){
            return AxiosService.get(friendEndpoint+"/search", {searchName});
          }
      
          unfriend(friendId) {
              return AxiosService.delete(`${friendEndpoint}/unfriend/${friendId}`);
          }
}
      
export default new FriendAPI();