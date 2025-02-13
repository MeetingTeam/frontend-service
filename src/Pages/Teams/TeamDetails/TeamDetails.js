import "./TeamDetails.css"
import { Link } from "react-router-dom";
import Members from "./Members/Members.js";
import PendingRequest from "./PendingRequests/PendingRequest.js";
import Settings from "./Settings/Settings.js";
import Channels from "./Channels/Channels.js";
import { useSelector } from "react-redux";
import { tabTitles, teamRoles } from "../../../Utils/Constraints.js";

const TeamDetails=({team, channelInfo, setChannelInfo})=>{
            const user=useSelector(state=>state.user);
            const roleOfOwner=team.members.find(member=>member.user.id==user.id)?.role;

           function handleTabClick(tabIndex){
                setChannelInfo({...channelInfo, tabIndex:tabIndex});
           }
          
           return(
                <>
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-9">
                                <nav className="nav nav-pills nav-justified">
                                            {tabTitles.map((title,index)=>
                                                <Link key={index} className={"nav-link"+(channelInfo.tabIndex===index?" active":"")} 
                                                                        onClick={()=>handleTabClick(index)}>{title}</Link>
                                        )}
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="chat-history">
                            {channelInfo.tabIndex==0&&<Members team={team}/>}
                            {channelInfo.tabIndex==1&&(roleOfOwner===teamRoles.LEADER)
                                &&<PendingRequest team={team}/>}
                            {channelInfo.tabIndex==2&&<Channels team={team}/>}
                            {channelInfo.tabIndex==3&&<Settings team={team}/>}
                    </div>
           </>
          )
}
export default TeamDetails;