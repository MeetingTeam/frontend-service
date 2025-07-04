import { useState } from "react"
import FriendRequests from "./FriendRequests/FriendRequests.jsx"
import "./RequestsPage.css"
import TeamRequests from "./TeamRequests/TeamRequests.jsx"

const RequestsPage=()=>{
        const tabTitles=["Friend Requests","Team Requests"]
        const [tab, setTab]=useState("Friend Requests")
        
        return(
          <div className="clearfix">
                <div className="card chat-app">
                    <div className="request-list">
                        <ul className="list-unstyled chat-list">
                                {tabTitles.map((title, index)=>
                                    <li className={"clearfix "+(tab==title?"active":"")} key={index} onClick={()=>setTab(title)}>
                                            <h6>{title}</h6>
                                    </li> 
                                )}                             
                        </ul>
                    </div>
                    {tab==="Friend Requests"&&<FriendRequests/>}
                    {tab=="Team Requests"&&<TeamRequests/>}
                </div>
          </div>
          )
}
export default RequestsPage;