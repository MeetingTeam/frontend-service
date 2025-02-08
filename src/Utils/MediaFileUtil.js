import { messageTypes } from "./Constraints.js";

export function getFileMessageType(fileType){
          let type= fileType.split('/')[0];
          if(type=="image") return messageTypes.IMAGE;
          else if(type=="video") return messageTypes.VIDEO;
          else if(type=="audio") return messageTypes.AUDIO;
          else return messageTypes.DOCUMENT;
}