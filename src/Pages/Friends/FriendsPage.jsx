import { useDispatch, useSelector } from "react-redux"
import "./FriendsPage.css"
import { getTimeDistance } from "../../Utils/DateTimeUtil.js";
import FriendChat from "./FriendChat.jsx";
import { useState } from "react";
import Avatar from "../../Components/Avatar/Avartar.jsx";
import FriendAPI from "../../APIs/user-service/FriendAPI.js";
import { loadMoreFriends } from "../../Redux/friendsReducer.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import { alertError } from "../../Utils/ToastUtil.js";

const FriendsPage=()=>{
          const dispatch= useDispatch();
          const friends=useSelector(state=>state.friends);
          const [indexChatFriend, setIndexChatFriend]=useState(0);
          const [searchTerm, setSearchTerm]=useState("");
          const [searchFriendIds, setSearchFriendIds]=useState(null);
  
          function handleFriendChat(e,friendId){
                e.preventDefault();
                setIndexChatFriend(friends.findIndex((friend)=>friend.id==friendId))
          }
          function handleShowMoreBtn(){
            FriendAPI.getFriends(friends.length/10,10).then(res=>{
                dispatch(loadMoreFriends(res.data.data));
            })
            .catch(err=>alertError(handleAxiosError(err)));
          }
        function handleSearchBtn(e){
            e.preventDefault();
            if(searchTerm&&searchTerm!="") {
                FriendAPI.searchFriendsByName(searchTerm).then(res=>{
                    var searchFriends=res.data;
                    setSearchFriendIds(new Set(searchFriends.map(searchFriend=>searchFriend.id)));
                    dispatch(loadMoreFriends(searchFriends));
                })
                .catch(err=>alertError(handleAxiosError(err)));
            }
            else if(searchFriendIds!=null) setSearchFriendIds(null);
        }
        function handleFilter(){
            if(!friends) return null;
            if(searchFriendIds!=null){
                return friends.filter(friend=>searchFriendIds.has(friend.id));
            }
            else return friends;
        }
        
        const filterFriends=handleFilter();
        const chatFriend=(filterFriends&&filterFriends.length>0)?filterFriends[indexChatFriend]:null;
          return(
                <div className="container-fluid">
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                                {/* people lists*/ }
                                <div id="plist" className="friends-management">
                                    <div className="friends-control">
                                        <form className="input-group" onSubmit={e=>handleSearchBtn(e)}>
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