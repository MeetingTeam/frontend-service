import { Route, Routes } from "react-router-dom";
import Navbar from "../Components/NavBar/Navbar.jsx";
import FriendsPage from "../Pages/Friends/FriendsPage.jsx";
import NotFoundPage from "../Pages/Error/NotFoundPage.jsx";
import DashboardPage from "../Pages/Dashboard/DashboardPage.jsx";
import TeamsPage from "../Pages/Teams/TeamsPage.jsx";
import RequestsPage from "../Pages/Requests/RequestsPage.jsx";
import DataLoading from "../DataLoading/DataLoading.jsx";
import UserSettings from "../Pages/User/UserSettings.jsx";
import CalendarPage from "../Pages/Calendar/CalendarPage.jsx";

const ClientRouter=()=>{
          return(
          <DataLoading>
                    <Navbar/>
                    <Routes>
                              <Route path="/friendsPage" element={<FriendsPage/>}/>
                              <Route path="/teams" element={<TeamsPage/>}/>
                              <Route path="/userSettings" element={<UserSettings/>}/>
                              <Route path="/requests" element={<RequestsPage/>}/>
                              <Route path="/calendar" element={<CalendarPage/>}/>
                              <Route path="/*" element={<NotFoundPage/>}/>
                    </Routes>
          </DataLoading>
          )
}
export default ClientRouter;