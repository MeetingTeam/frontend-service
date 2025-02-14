import { useDispatch, useSelector } from "react-redux";
import { getDateTime, getTimeDistance } from "../../Utils/DateTimeUtil.js";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MessageDropdown from "../../Components/Message/MessageDropdown.js";
import ReplyAlert from "../../Components/Message/ReplyAlert.js";
import { loadMoreMessages } from "../../Redux/friendsReducer.js";
import EmojiPicker from "emoji-picker-react";
import MessageType from "../../Components/Message/MessageType.js";
import Avatar from "../../Components/Avatar/Avartar.js";
import UnfriendModal from "./Components/UnfriendModal.js";
import MessageAPI from "../../APIs/chat-service/MessageAPI.js";
import { useSnackbarUtil } from "../../Utils/SnackbarUtil.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import ReactionDetails from "../../Components/Message/ReactionDetails.js";
import ReactionList from "../../Components/Message/ReactionList.js";
import MediaFileAPI from "../../APIs/chat-service/MediaFileAPI.js";
import EmojiPickerPopover from "../../Components/ChatControl/EmojiPickerPopover.js";


const FriendChat=({friend, indexChatFriend})=>{
          const dispatch=useDispatch();
          const { showErrorMessage } = useSnackbarUtil();
          const user=useSelector(state=>state.user);
          const [textContent, setTextContent]=useState("");
          const [replyMessage, setReplyMessage]=useState(null);
          const [reactions, setReactions]=useState(null);
          const [showUnfriend, setShowUnfriend]=useState(false);
          
          useEffect(()=>{
                if(!friend.messages){
                    MessageAPI.getPrivateMessages(0, friend.id).then(res=>{
                        dispatch(loadMoreMessages({messages: res.data,friendIndex: indexChatFriend}))
                    })
                    .catch(err=>showErrorMessage(handleAxiosError(err)));
                }
          },[friend])
          
          function submitMessage(e){
                e.preventDefault();
                if(textContent=="") return;
                const chatMessage={
                    recipientId: friend.id,
                    content: textContent
                }
                if(replyMessage){
                    chatMessage.parentMessageId=replyMessage.id;
                    setReplyMessage(null);
                }
                MessageAPI.sendTextMessage(chatMessage)
                        .catch(err=>showErrorMessage(handleAxiosError(err)));
                setTextContent("");
          }
          function handleAddMessagesButton(){
               let messagesNum=friend.messages?friend.messages.length:0;
               MessageAPI.getPrivateMessages(messagesNum, friend.id).then(res=>{
                        dispatch(loadMoreMessages({
                            messages: res.data, 
                            friendIndex: indexChatFriend
                    }))
                })
                .catch(err=>showErrorMessage(handleAxiosError(err)));
          }
          function handleUpload(e){
                const file=e.target.files[0];
                if(!file) {
                    showErrorMessage("File is not choosen. Please try again");
                    return;
                }
                if(file.size>100000000) {
                    showErrorMessage("File too big");
                    return;
                }
                MediaFileAPI.uploadFileToS3(file).then(fileUrl=>{
                        const fileMessage={
                            recipientId: friend.id,
                            mediaFile: {
                                fileUrl: fileUrl,
                                fileType: file.type,
                                fileSizeInBytes: file.size
                            }
                        }
                        MediaFileAPI.sendFileMessage(fileMessage)
                            .catch(()=> showErrorMessage("Failed to uplaod file"));
                })
                .catch(()=> showErrorMessage("Failed to upload file"));
                e.target.value="";
          }
          function handleEmojiPicker(emojiData){
                setTextContent(prev=>prev+emojiData.emoji);
          }
          return(
            <>
                {reactions&&<ReactionDetails  reactions={reactions} people={[user, friend]} setShow={setReactions}/>}
                {showUnfriend&&<UnfriendModal friend={friend} setShow={setShowUnfriend}/>}
                <div className="chat">
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-6">
                                    <Avatar src={friend.urlIcon}/>
                                    <div className="chat-about">
                                        <h6 className="mb-0">{friend.nickName}</h6>
                                        <small>Last seen: {getTimeDistance(friend.lastActive)}</small>
                                    </div>
                                </div>
                                <div className="col-lg-6 hidden-sm text-end">
                                    <Link to="#" onClick={()=>setShowUnfriend(true)} className="btn btn-outline-secondary"><i className="fa fa-hand-paper-o" aria-hidden="true"></i></Link>
                                    <Link to="#" className="btn btn-outline-primary"><i className="fa fa-phone"></i></Link>
                                </div>
                            </div>
                        </div>
                    <div className="chat-history">
                        <button className="btn btn-success" onClick={handleAddMessagesButton}>See more messages</button>
                        <ul className="m-b-0">
                            {friend.messages&&friend.messages.map((message)=>{
                                let parentMessage=null;
                                if(message.parentMessageId){
                                    const index=friend.messages.findIndex(mess=>mess.id==message.parentMessageId);
                                    if(index>=0){
                                        parentMessage={...friend.messages[index]};
                                        if(parentMessage.content.length>61) parentMessage.content=parentMessage.content.substring(0,60)+"...";
                                    }
                                }
                                if(message.senderId===friend.id)
                                        return(
                                            <li className="clearfix" key={message.id}>
                                                <div className="message-data text-begin">
                                                    <Avatar src={friend.urlIcon}/>
                                                    <span className="message-data-time">
                                                        <small>{getDateTime(message.createdAt)}</small>
                                                    </span>
                                                </div>
                                                <div className="message-data d-flex justify-content-begin">
                                                        <div className="message other-message">
                                                                {parentMessage&&
                                                                <div className="replyMessage">Response to <b>{friend.nickName}</b>: {parentMessage.content}</div>}
                                                                <MessageType message={message}/>
                                                                <ReactionList reactions={message.reactions} setReactions={setReactions}/>
                                                         </div>
                                                         <MessageDropdown message={message} setTextContent={setTextContent} setReplyMessage={setReplyMessage}/>
                                                    </div>
                                            </li>  
                                        )
                                    else return(
                                        <li className="clearfix" key={message.id}>
                                                <div className="message-data text-end">
                                                    <span className="message-data-time">
                                                        <small>{getDateTime(message.createdAt)}</small>
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                        <MessageDropdown message={message} setTextContent={setTextContent} setReplyMessage={setReplyMessage}/>
                                                        <div className="message my-message">
                                                        {parentMessage&&
                                                                <div className="replyMessage">Response to <b>{user.nickName}</b>: {parentMessage.content}</div>}
                                                                <MessageType message={message}/>
                                                                <ReactionList reactions={message.reactions} setReactions={setReactions}/>
                                                         </div>
                                                </div>
                                            </li>
                                    )
                            })}                           
                        </ul>
                    </div>
                    <div className="chat-control clearfix">
                        <div className="row justify-content-begin mb-1">
                            <div className="col-lg-auto">
                                <input type="file" id="fileUpload" onChange={(e)=>handleUpload(e)}  style={{display: 'none'}}/>
                                <button className="btn btn-sm btn-outline-secondary" onClick={()=>document.getElementById("fileUpload").click()}><i className="fa fa-paperclip"></i></button>
                            </div> 
                            <div className="col-lg-auto">
                                   <EmojiPickerPopover handleEmojiPicker={handleEmojiPicker}/>
                            </div>
                        </div>
                        {replyMessage&&<ReplyAlert replyMessage={replyMessage} setReplyMessage={setReplyMessage}/>}
                        <form className="input-group mb-0" onSubmit={(e)=>submitMessage(e)}>
                            <input type="text" className="form-control" placeholder="Enter text here..." onChange={(e)=>setTextContent(e.target.value)} value={textContent}/>  
                            <button className="input-group-text"><i className="fa fa-send"></i></button>                                  
                        </form>
                    </div>
                </div>
            </>
          )
}
export default FriendChat;