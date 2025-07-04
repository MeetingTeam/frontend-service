import { Link, useNavigate} from "react-router-dom";
import companyIcon from "../../Resources/HUNG_TRAN.png"
import { useSelector } from "react-redux";
import Avatar from "../Avatar/Avartar.jsx";
import CognitoService from "../../Services/CognitoService.js";
import WebSocketService from "../../Services/WebSocketService.js";

const Navbar=()=>{
          const user=useSelector(state=>state.user);

          function handleSignOut(){
              CognitoService.signOut();
              WebSocketService.disconnect();
          }
          return(
                  <header className="pb-2 border-bottom">
                    <div className="container">
                      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
                              <img src={companyIcon} alt="companyIcon" width="40" height="40"/>
                        </Link>
                
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                          <li><Link to="/friendsPage" className="nav-link px-2 link-body-emphasis">Friends</Link></li>
                          <li><Link to="/teams" className="nav-link px-2 link-body-emphasis">Teams</Link></li>
                          <li><Link to="/requests" className="nav-link px-2 link-body-emphasis">Requests</Link></li>
                          <li><Link to="/calendar" className="nav-link px-2 link-body-emphasis"><i className="fa fa-calendar" aria-hidden="true"></i> Calendar</Link></li>
                        </ul>
                
                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                          <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/>
                        </form>
                
                        <div className="dropdown text-end">
                          <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            {user&&<Avatar src={user.urlIcon}/>}
                          </a>
                          <ul className="dropdown-menu text-small">
                            <li><Link className="dropdown-item" to="/userSettings">Profile</Link></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><Link to="/login" className="dropdown-item" onClick={()=>handleSignOut()}>Sign out</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </header>
          )
}
export default Navbar;