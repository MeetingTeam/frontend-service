import { Route, Routes } from "react-router-dom";
import Navbar from "../Components/NavBar/Navbar.js";
import ErrorPage from "../Pages/Error/ErrorPage.js";
import TeamsPage from "../Pages/Teams/TeamsPage.js";
import UserSettings from "../Pages/User/UserSettings.js";
import FriendsPage from "../Pages/Friends/FriendsPage.js";
import RequestsPage from "../Pages/Requests/RequestsPage.js";
import CalendarPage from "../Pages/Calendar/CalendarPage.js";
import DashboardPage from "../Pages/Dashboard/DashboardPage.js";

const ClientRouter=()=>{
          return(
          <>
                    <Navbar/>
                    <Routes>
                              <Route path="/" element={<DashboardPage/>}/>
                              <Route path="/friendsPage" element={<FriendsPage/>}/>
                              <Route path="/teams" element={<TeamsPage/>}/>
                              <Route path="/userSettings" element={<UserSettings/>}/>
                              <Route path="/requests" element={<RequestsPage/>}/>
                              <Route path="/calendar" element={<CalendarPage/>}/>
                              <Route path="/*" element={<ErrorPage/>}/>
                    </Routes>
          </>
          )
}
export default ClientRouter;