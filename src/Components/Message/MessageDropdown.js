import { useSelector } from "react-redux";
import { messageTypes } from "../../Utils/Constraints.js";
import MessageAPI from "../../APIs/chat-service/MessageAPI.js";
import { useSnackbarUtil } from "../../Utils/SnackbarUtil.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import "./Message.css"

const MessageDropdown=({message, setTextContent, setReplyMessage})=>{
          const user=useSelector(state=>state.user);
          const { showErrorMessage } = useSnackbarUtil();
          if(message.messageType==messageTypes.TEXT) return;

          function handleDropdownItem(e){
              e.preventDefault();
              var name=e.target.name;
              if(name=="Edit") setTextContent(message.content);
              else if(name=="Reply") setReplyMessage(message);
              else if(name=="Unsend"){
                  MessageAPI.unsendMessage(message.id)
                    .catch(err=>showErrorMessage(handleAxiosError(err)));
              }
          }

          const emojiCodes = ["❤️", "😀", "🙁", "🙂"];
          function handleEmoji(e,emojiCode){
                e.preventDefault();
                MessageAPI.reactMessage({
                    messageId: message.id,
                    emojiCode: emojiCode
                })
                .catch(err=>showErrorMessage(handleAxiosError(err)));
          }
          
          return(
              <div className="dropdown">
                  <button className="btn btn-light btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          {message.type==messageTypes.TEXT&&
                            <button className="dropdown-item" name="Edit" onClick={(e)=>handleDropdownItem(e)}>Edit</button>}
                          <button className="dropdown-item" name="Reply" onClick={(e)=>handleDropdownItem(e)}>Reply</button>
                          {message.senderId==user.id&&
                            <button className="dropdown-item" name="Unsend" onClick={(e)=>handleDropdownItem(e)}>Unsend</button>}
                          <div>
                                  <div className="d-flex align-items-center bg-light rounded-pill reaction-list">
                                      {emojiCodes.map((emojiCode, index)=>
                                          <span className="fs-4 me-2" key={index} onClick={(e)=>handleEmoji(e, emojiCode)}><small>{emojiCode}</small></span>
                                      )}
                                      <span className="fs-4 me-2" onClick={(e)=>handleEmoji(e, null)}><small>X</small></span>
                                  </div> 
                              </div>
                  </div>
              </div>
          )
      }
export default MessageDropdown;