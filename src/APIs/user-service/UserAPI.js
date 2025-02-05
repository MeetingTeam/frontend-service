import AxiosService from "../../Util/AxiosService.js";
import { USER_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";

const userEndpoint=USER_SERVICE_ENDPOINT+"/user";

class UserAPI {
          addUser(createUserDto){
                   return AxiosService.post(userEndpoint, createUserDto);
          }

          updateUser(updateUserDto) {
                    return AxiosService.patch(userEndpoint, updateUserDto);
          }
            
          getUserInfo() {
                    return AxiosService.get(userEndpoint);
          }
}
export default new UserAPI();