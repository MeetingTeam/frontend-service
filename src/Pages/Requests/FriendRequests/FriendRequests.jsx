import { useState } from "react";
import SendedRequests from "./SendedRequests/SendedRequests.jsx";
import { Link } from "react-router-dom";
import ReceivedRequests from "./ReceivedRequests/ReceivedRequests.jsx";

const FriendRequests=()=>{
          const tabTitles=["Received Requests","Sended Requests"];
          const [tab, setTab]=useState("Received Requests");
          
          return(
                <div className="chat">
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-6">
                              <nav className="nav nav-pills nav-justified">
                                        {tabTitles.map((title)=>
                                        <Link key={title} className={"nav-link"+(tab===title?" active":"")} onClick={(e)=> setTab(title)}>{title}</Link>
                                        )}
                              </nav>
                            </div>
                        </div>
                    </div>
                    <div className="request-history">
                        {tab=="Sended Requests"&&<SendedRequests/>}
                        {tab=="Received Requests"&&<ReceivedRequests/>}
                    </div>
                </div>
          )
}
export default FriendRequests;