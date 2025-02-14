import axios from "axios";
import AxiosService from "../../Services/AxiosService.js";
import { CHAT_SERVICE_ENDPOINT } from "../../Utils/EnvStore.js";
import MessageAPI from "./MessageAPI.js";

const mediaFileEndpoint= CHAT_SERVICE_ENDPOINT+"/media-file";
class MediaFileAPI {
          generateS3PresignedUrl(presignedUrlDto){
                    return AxiosService.post(mediaFileEndpoint+"/presigned-url",presignedUrlDto);
          }

          async uploadFileToS3(file){
                    const res= await this.generateS3PresignedUrl({
                              fileName: file.name,
                              fileType: file.type,
                              fileSize: file.size
                    });
                    const presignedUrl= res.data;
                    await axios.put(presignedUrl, file, {
                                        headers: {
                                                  "Content-Type": file.type,
                                                  "x-amz-tagging": "isLinked=false"
                                        }
                              });
                    return presignedUrl.split('?')[0];
          }

          sendFileMessage(messageDto, file){
                    return AxiosService.post(mediaFileEndpoint, messageDto);
          }
}

export default new MediaFileAPI();