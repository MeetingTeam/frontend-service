import { useDispatch, useSelector } from "react-redux"
import "./FriendsPage.css"
import { getTimeDistance } from "../../Utils/DateTimeUtil.js";
import FriendChat from "./FriendChat.js";
import { useState } from "react";
import Avatar from "../../Components/Avatar/Avartar.js";
import FriendAPI from "../../APIs/user-service/FriendAPI.js";
import { loadMoreFriends } from "../../Redux/friendsReducer.js";
import { useSnackbarUtil } from "../../Utils/SnackbarUtil.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";

const FriendsPage=()=>{
          const dispatch= useDispatch();
          const { showErrorMessage } = useSnackbarUtil();
          const friends=useSelector(state=>state.friends);
          const [indexChatFriend, setIndexChatFriend]=useState(0);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("")

          
          function handleFriendChat(e,friendId){
                e.preventDefault();
                setIndexChatFriend(friends.findIndex((friend)=>friend.id==friendId))
          }
          function handleShowMoreBtn(){
            FriendAPI.getFriends(friends.length/10,10).then(res=>{
                dispatch(loadMoreFriends(res.data.data));
            })
            .catch(err=>showErrorMessage(handleAxiosError(err)));
          }
          const handleFilter = (item) => {
            const re = new RegExp("^"+search,"i");
            return item.nickName.match(re);
        }
        
        const chatFriend=(friends&&friends.length>0)?friends[indexChatFriend]:null;
        let filterFriends=(search==="")?friends:friends.filter(handleFilter);
          return(
                <div className="container-fluid">
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                                {/* people lists*/ }
                                <div id="plist" className="friends-management">
                                    <div className="friends-control">
                                        <form className="input-group" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                                <span className="input-group-text"><i className="fa fa-search"></i></span>
                                                <input type="text" className="form-control" placeholder="Search..." onChange={(e)=>setSearchTerm(e.target.value)}/>
                                        </form>
                                    </div>
                                    <div className="friends-list">
                                        <ul className="list-unstyled chat-list mt-2 mb-0">
                                            {filterFriends.map((friend)=>{
                                                    return(
                                                    <li className="clearfix" key={friend.id} onClick={(e)=>handleFriendChat(e, friend.id)}>
                                                                <Avatar src={friend.urlIcon}/>
                                                                <div className="about">
                                                                        <div className="name">{friend.nickName}</div>
                                                                        <div className="status">
                                                                        {friend.isOnline?<i className="fa fa-circle online"> online</i>:<i className="fa fa-circle offline">left {getTimeDistance(friend.lastActive)}</i>}
                                                                            </div>                                            
                                                                </div>
                                                    </li>
                                                    )
                                            })}
                                        </ul>
                                        <button className="mt-1 w-100 btn btn-outline-secondary" onClick={()=>handleShowMoreBtn()}>Show More</button>
                                    </div>
                                </div>
                               {chatFriend&&<FriendChat friend={chatFriend} indexChatFriend={indexChatFriend}/>}
                            </div>
                        </div>
                    </div>
                </div>
          )
}
export default FriendsPage;