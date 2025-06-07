import { Link } from "react-router-dom";
import "./Dashboard.css"

const DashboardPage = () =>(
          <div className="dashboard-layout">
              <h3 className="mb-3">Meeting Team</h3>
              <div className="border border-dark rounded p-4">
                      <h5>Author: Q.Hung&T.Hung - Email: 22520527@gm.uit.edu.vn</h5>
                      <h5 className="fst-italic"> A personal website about chat and video call application</h5>
                      <ol>
                              <li>The "Friends" tab shows list of active friends</li>
                              <li>The "Teams" tab shows list of teams you have joined in</li>
                              <li>The "Requests" shows all team and friend requests</li>
                              <li>The "Calendar" tab shows your upcoming meetings</li>
                      </ol>
              </div>

            <div className="call-to-action">
                <p>To get started, please <Link to="/login">log in</Link> or <Link to="/register">create an account</Link>.</p>
            </div>
          </div>
    );
export default DashboardPage;