import { useEffect, useState } from "react"
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import ZegoAPI from "../../APIs/meeting-service/ZegoAPI.js";
import { alertError } from "../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";

const ZegoMeeting=()=>{
         const [data, setData]=useState(null);
         const meetingId=getMeetingId();
          useEffect(()=>{
                if(meetingId){
                    ZegoAPI.generateZegoToken(meetingId)
                            .then(res=>{
                                setData(res.data);
                            })
                            .catch(err=>alertError(handleAxiosError(err)));
                } 
          },[]); 

          function getMeetingId() {
                    let urlStr = window.location.href.split('?')[1];
                    const urlSearchParams = new URLSearchParams(urlStr);
                    const result = Object.fromEntries(urlSearchParams.entries());
                    return result["meetingId"];
          }   
          const videoConference=async(element)=>{
                    const kitToken= ZegoUIKitPrebuilt.generateKitTokenForProduction(
                              data.appId,
                              data.token, 
                              meetingId, 
                              data.user.id, 
                              data.user.nickName
                          );

                    const zp = ZegoUIKitPrebuilt.create(kitToken);

                    zp.joinRoom({
                              container: element,
                              sharedLinks: [
                                        {
                                        name: 'Personal link',
                                        url: window.location.protocol + '//' +window.location.host 
                                                  + window.location.pathname +'?meetingId=' +meetingId
                                        },
                              ],
                              scenario: {
                                        mode: ZegoUIKitPrebuilt.VideoConference
                              },
                              turnOnMicrophoneWhenJoining: true,
                              turnOnCameraWhenJoining: true,
                              showMyCameraToggleButton: true,
                              showMyMicrophoneToggleButton: true,
                              showAudioVideoSettingsButton: true,
                              showScreenSharingButton: true,
                              showTextChat: true,
                              showUserList: true,
                              maxUsers: 50,
                              layout: "Sidebar",
                              showLayoutButton: true,
                    });
          }     
          
          return(
                    <>
                        {data&&<div className="myCallContainer" 
                                        ref={videoConference}
                                        style={{ width: '100vw', height: '100vh' }}
                        ></div>}
                    </>
          )
}
export default ZegoMeeting;