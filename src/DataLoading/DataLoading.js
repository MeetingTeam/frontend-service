import { useDispatch, useSelector } from "react-redux";
import {loadFriends} from "../Redux/friendsReducer.js";
import WebSocketService from "../Services/WebSocketService.js";
import {loadTeams} from "../Redux/teamsReducer.js";
import { loadUser } from "../Redux/userReducer.js";
import { useEffect } from "react";
import { subscribeToTeamTopics } from "../WebsocketListeners/TeamWsListener.js";
import { subscribeToUserTopics } from "../WebsocketListeners/UserWsListener.js";
import { Spinner } from "react-bootstrap";
import UserAPI from "../APIs/user-service/UserAPI.js";
import FriendAPI from "../APIs/user-service/FriendAPI.js";
import TeamAPI from "../APIs/team-service/TeamAPI.js";
import { alertError } from "../Utils/ToastUtil.js";

const DataLoading=({children})=>{
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user);
  const teams=useSelector(state=> state.teams);
  const friends=useSelector(state=>state.friends);
  
  useEffect(()=>{
    const fetchData = async () => {
      if (!user) {
        UserAPI.getUserInfo().then(res=>{
          dispatch(loadUser(res.data));
        })
        .catch(err=>alertError("Unable to load data. Please try again"));
      }
      if(!friends){
        FriendAPI.getFriends(0, 10).then(res=>{
                dispatch(loadFriends(res.data.data))
        })
        .catch(err=>alertError("Unable to load data. Please try again"));
      }
      if(!teams){
        TeamAPI.getJoinedTeams(0, 10).then(res=>{
          dispatch(loadTeams(res.data.data));
        })
        .catch(err=>alertError("Unable to load data. Please try again"));
      }
    };
    
    fetchData();
    WebSocketService.connect();
  },[dispatch, user, friends, teams])
  
  useEffect(()=>{
    if(user){
      subscribeToUserTopics(user, dispatch);
    }
  },[user, dispatch])
  
  useEffect(()=>{
      if(teams){
        teams.forEach((team)=>{
          subscribeToTeamTopics(team, dispatch);
        })
      }
  },[teams, dispatch])
  
  if(user&&friends&&teams) return children;
  else return (<Spinner animation="border" variant="primary" />)
}
export default DataLoading;