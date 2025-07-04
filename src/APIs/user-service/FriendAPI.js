import { USER_SERVICE_ENDPOINT } from "../../Configs/EnvConfig.js";
import AxiosService from "../../Services/AxiosService.js";

const friendEndpoint= USER_SERVICE_ENDPOINT+"/friend";
class FriendAPI {
          getFriends(pageNo, pageSize) {
              pageNo= Math.floor(pageNo);
              return AxiosService.get(friendEndpoint, {pageNo, pageSize});
          }

          searchFriendsByName(searchName){
            return AxiosService.get(friendEndpoint+"/search", {searchName});
          }
      
          unfriend(friendId) {
              return AxiosService.delete(`${friendEndpoint}/unfriend/${friendId}`);
          }
}
      
export default new FriendAPI();