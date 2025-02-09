import { createSlice } from "@reduxjs/toolkit";
import { messageTypes } from "../Utils/Constraints.js";

const teamsReducer=createSlice({
          name: "teams",
          initialState: null,
          reducers:{
                    loadTeams:(state, action)=>{
                              return action.payload;
                    },
                    loadMoreTeams: (state, action)=>{
                              const addedTeams= action.payload;
                              const stateTeamsSet= new Set(state.map(team=>team.id));
                              addedTeams.forEach(addedTeam=>{
                                        if(!stateTeamsSet.has(addedTeam.id))
                                                  state.push(addedTeam);
                              });
                    },
                    addTeamChatMessage:(state,action)=>{
                              const message=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==message.teamId);
                              if(teamIndex>-1){
                                        let channelIndex=state[teamIndex].channels.findIndex(channel=>channel.id==message.channelId);
                                        if(channelIndex>-1){
                                                  let channel={...state[teamIndex].channels[channelIndex]};
                                                  if(channel.messages){
                                                            let messIndex=channel.messages.findIndex(mess=>mess.id==message.id);
                                                            if(messIndex>-1){
                                                                      if(message.type==messageTypes.VOTING){
                                                                                channel.messages=channel.messages.filter(mess=>mess.id!=message.id);
                                                                                channel.messages.push(message);
                                                                      }                                                         
                                                                      else channel.messages[messIndex]=message;
                                                            } 
                                                            else channel.messages.push(message);
                                                  }
                                                  else channel.messages=[message];
                                                  state[teamIndex].channels[channelIndex]=channel;
                                        }
                              }                       
                    },
                    loadMoreMessages:(state, action)=>{
                              const {channelInfo,messages}=action.payload;
                              let channel=state[channelInfo.teamIndex].channels[channelInfo.channelIndex];
                              if(!channel.messages||channel.messages.length==0)
                                        channel.messages=messages;
                              else{
                                        let lastIndex=messages.findIndex(mess=>mess.id==channel.messages[0].id);        
                                        if(lastIndex==-1) lastIndex=messages.length;
                                        let portion=messages.slice(0,lastIndex);
                                        channel.messages=portion.concat(...channel.messages);
                              }
                              state[channelInfo.teamIndex].channels[channelInfo.channelIndex]=channel;
                    },
                    loadChannelMeetings:(state, action)=>{
                              const {channelInfo, meetings}=action.payload;
                              let channel=state[channelInfo.teamIndex].channels[channelInfo.channelIndex];
                              if(!channel.meetings||channel.meetings.length==0)
                                        channel.meetings=meetings;
                              else{
                                        let lastIndex=meetings.findIndex(meeting=>meeting.id==channel.meetings[0].id);        
                                        if(lastIndex==-1) lastIndex=meetings.length;
                                        let portion=meetings.slice(0,lastIndex);
                                        channel.meetings=portion.concat(...channel.meetings);
                              }
                              state[channelInfo.teamIndex].channels[channelInfo.channelIndex]=channel;
                              return state;
                    },
                    addMeeting:(state, action)=>{
                              let meeting=action.payload;
                              let teamIndex=state.findIndex(team=>team.id==meeting.teamId);
                              if(teamIndex>-1){
                                        let channelIndex=state[teamIndex].channels.findIndex(channel=>channel.id==meeting.channelId);
                                        if(channelIndex>-1){
                                                  const channel={...state[teamIndex].channels[channelIndex]};
                                                  if(channel.meetings){
                                                            let meetIndex=channel.meetings.findIndex(m=>m.id==meeting.id);
                                                            if(meetIndex>-1) channel.meetings[meetIndex]=meeting;
                                                            else channel.meetings.push(meeting);
                                                  }
                                                  else channel.meetings=[meeting]
                                                  state[teamIndex].channels[channelIndex]=channel;
                                        }
                              }
                    },
                    deleteMeeting:(state, action)=>{
                              const {teamId, channelId, meetingId}=action.payload;
                              let teamIndex=state.findIndex(team=>team.id==teamId);
                              if(teamIndex>-1){
                                        let team={...state[teamIndex]};
                                        let channelIndex=team.channels.findIndex(channel=>channel.id==channelId);
                                        team.channels[channelIndex].meetings=team.channels[channelIndex].meetings.filter(meeting=>meeting.id!=meetingId);
                                        state[teamIndex]=team;
                              }
                    },
                    updateTeam:(state, action)=>{
                              const updatedTeam=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==updatedTeam.id);
                              if(teamIndex==-1) state.push(updatedTeam);
                              else state[teamIndex]={...state[teamIndex], teamName:updatedTeam.teamName, urlIcon: updatedTeam.urlIcon, autoAddMember: updatedTeam.autoAddMember}
                    },
                    deleteTeam:(state, action)=>{
                              const teamId=action.payload;
                              return state.filter(team=>team.id!==teamId);
                    },
                    addMembers:(state, action)=>{
                              const {teamId,newMembers}=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==teamId);
                              const members={...state[teamIndex].members};
                              if(members&&members.length){
                                        newMembers.forEach(newMember=> {
                                                  const memberIndex=members.findIndex(member=>member.u.id==newMember.u.id);
                                                  if(memberIndex>=0) members[memberIndex]=newMember;
                                                  else members.push(newMember);
                                        });
                                        state[teamIndex].members=members;
                              }
                              else state[teamIndex].members= newMembers;
                    },
                    addChannel:(state, action)=>{
                              const {teamId, newChannel}=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==teamId);
                              let channelIndex=state[teamIndex].channels.findIndex(channel=>channel.id==newChannel.id);
                              if(channelIndex>=0) state[teamIndex].channels[channelIndex]=newChannel;
                              else state[teamIndex].channels.push(newChannel);
                    },
                    removeChannel:(state, action)=>{
                              const {teamId, channelId}=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==teamId);
                              state[teamIndex].channels=state[teamIndex].channels.filter(channel=>channel.id!=channelId);
                    }
          }
})
export const {loadTeams,loadMoreTeams, addTeamChatMessage, loadMoreMessages,
            loadChannelMeetings, addMeeting,deleteMeeting,
           addMembers, addChannel, removeChannel, 
           updateTeam, deleteTeam} =teamsReducer.actions;
export default teamsReducer.reducer;