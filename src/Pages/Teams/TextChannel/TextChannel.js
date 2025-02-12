import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MessageType from "../../../Components/Message/MessageType.js";
import MessageDropdown from "../../../Components/Message/MessageDropdown.js";
import ReplyAlert from "../../../Components/Message/ReplyAlert.js";
import { loadMoreMessages } from "../../../Redux/teamsReducer.js";
import Avatar from "../../../Components/Avatar/Avartar.js";
import Voting from "../../../Components/Voting/Voting.js";
import VotingModal from "../../../Components/Voting/VotingModal.js";
import VoteDetailModal from "../../../Components/Voting/VoteDetailsModal.js";
import CreateVoteModal from "../../../Components/Voting/CreateVoteModal.js";
import MessageAPI from "../../../APIs/chat-service/MessageAPI.js";
import { messageTypes } from "../../../Utils/Constraints.js";
import { useSnackbarUtil } from "../../../Utils/SnackbarUtil.js";
import { handleAxiosError } from "../../../Utils/ErrorUtil.js";
import MediaFileAPI from "../../../APIs/chat-service/MediaFileAPI.js";
import { getDateTime } from "../../../Utils/DateTimeUtil.js";
import ReactionList from "../../../Components/Message/ReactionList.js";
import ReactionDetails from "../../../Components/Message/ReactionDetails.js";
import EmojiPickerPopover from "../../../Components/ChatControl/EmojiPickerPopover.js";
import { alertError } from "../../../Utils/ToastUtil.js";

const TextChannel=({team, channel, channelInfo})=>{
            const dispatch=useDispatch();
            const { showErrorMessage } = useSnackbarUtil();
            const user=useSelector(state=>state.user);
            const [textContent, setTextContent]=useState("");
            const [replyMessage, setReplyMessage]=useState(null);
            const [reactions, setReactions]=useState(null);
            const [showVoting, setShowVoting]=useState({type:0, message:null});

            useEffect(()=>{
                if(!channel.messages){
                    MessageAPI.getTextChannelMessages(0, channel.id).then(res=>{
                        dispatch(loadMoreMessages({
                            channelInfo: channelInfo, 
                            messages: res.data}))
                    })
                }
            },[channelInfo])
            
            function submitMessage(e){
                e.preventDefault();
                const textMessage={
                    teamId: team.id,
                    channelId: channel.id,
                    content: textContent,
                    type: messageTypes.TEXT
                }
                if(replyMessage){
                    textMessage.parentMessageId=replyMessage.id;
                    setReplyMessage(null);
                }
                MessageAPI.sendTextMessage(textMessage).catch(err=>showErrorMessage(handleAxiosError(err)));
                setTextContent("");
          }
          function handleAddMessagesButton(){
                let messageNum=channel.messages?channel.messages.length:0;
                MessageAPI.getTextChannelMessages(messageNum, channel.id).then(res=>{
                    dispatch(loadMoreMessages({channelInfo: channelInfo, messages: res.data}))
                })
                .catch(err=>alertError("Unable to load more messages"));
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
                                      teamId: team.id,
                                      channelId: channel.id,
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
                    {reactions&&<ReactionDetails reactions={reactions} people={team.members.map(member=>member.u)} setShow={setReactions}/>}
                    {showVoting.type==1&&<VotingModal nickName={user.nickName} message={showVoting.message} setShow={setShowVoting}/>}
                    {showVoting.type==2&&<VoteDetailModal message={showVoting.message} setShow={setShowVoting} team={team}/>}
                    {showVoting.type==3&&<CreateVoteModal teamId={team.id} nickName={user.nickName}  setShow={setShowVoting} channel={channel}/>}
                    <div className="chat-history">
                        <button className="btn btn-success" onClick={handleAddMessagesButton}>See more messages</button>
                        <ul className="m-b-0">
                            {team.members&&channel.messages?.map((message)=>{
                                let parentMessage=null;
                                if(message.parentMessageId){
                                    const index=channel.messages.findIndex(mess=>mess.id==message.parentMessageId);
                                    if(index>=0){
                                        parentMessage={...channel.messages[index]};
                                        parentMessage.sender=team.members.filter(member=>member.u.id==parentMessage.senderId)[0].u;
                                        if(parentMessage.content.length>61) parentMessage.content=parentMessage.content.substring(0,60)+"...";
                                        }
                                    }
                                    if(message.type==messageTypes.VOTING){
                                        if(message.notShow) return;
                                        let creatorNickName=user.nickName;
                                        if(message.senderId!=user.id){
                                            const sender=team.members.find((member)=>member.u.id==message.senderId).u;
                                            creatorNickName=sender.nickName;
                                        }
                                        return (<Voting key={message.id} message={message} setShow={setShowVoting} creatorNickName={creatorNickName}/>)
                                    }
                                    else if(message.senderId!=user.id){
                                        const sender = team.members.find(member => member.user.id == message.senderId)?.user;
                                        if(sender) {
                                            return(
                                                <li className="clearfix" key={message.id}>
                                                    <div className="message-data text-begin">
                                                        <Avatar src={sender.urlIcon}/>
                                                        <span className="message-data-time"><b>{sender.nickName}</b> <small>{getDateTime(message.createdAt)}</small></span>
                                                    </div>
                                                    <div className="message-data d-flex justify-content-begin">
                                                        <div className="message other-message">
                                                                {parentMessage&&
                                                                    <div className="replyMessage">Response to <b>{parentMessage.sender.nickName}</b>: {parentMessage.content}</div>}
                                                                    <MessageType message={message}/>
                                                                    <ReactionList reactions={message.reactions} setReactions={setReactions}/>
                                                            </div>
                                                                 <MessageDropdown message={message} setTextContent={setTextContent} setReplyMessage={setReplyMessage}/>
                                                        </div>
                                                    </li>  
                                                )}
                                        }
                                else return(
                                        <li className="clearfix" key={message.id}>
                                                <div className="message-data text-end">
                                                    <span className="message-data-time"><small>{getDateTime(message.createdAt)}</small></span>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                        <MessageDropdown message={message} setTextContent={setTextContent} setReplyMessage={setReplyMessage}/>
                                                        <div className="message my-message">
                                                            {parentMessage&&
                                                                    <div className="replyMessage">Response to <b>{parentMessage.sender.nickName}</b>: {parentMessage.content}</div>}
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
                                <div className="row justify-content-begin" style={{marginBottom:"5px"}}>
                                    <div className="col-lg-auto">
                                        <input type="file" id="fileUpload" onChange={(e)=>handleUpload(e)}  style={{display: 'none'}}/>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>document.getElementById("fileUpload").click()}><i className="fa fa-paperclip"></i></button>
                                    </div> 
                                    <div className="col-lg-auto">
                                        <EmojiPickerPopover handleEmojiPicker={handleEmojiPicker}/>
                                    </div>
                                    <div className="col-lg-auto">
                                           <button className="btn btn-sm btn-outline-info" onClick={(e)=>setShowVoting({type:3, message:null})}><i className="fa fa-check-square"></i></button>
                                    </div>
                                </div>
                                {replyMessage&&<ReplyAlert replyMessage={replyMessage} setReplyMessage={setReplyMessage}/>}
                                <form className="input-group mb-0" onSubmit={(e)=>submitMessage(e)}>
                                    <input type="text" className="form-control" placeholder="Enter text here..." onChange={(e)=>setTextContent(e.target.value)} value={textContent}/>  
                                    <button className="input-group-text"><i className="fa fa-send"></i></button>                                  
                                </form>
                    </div>
           </>
          )
}
export default TextChannel;