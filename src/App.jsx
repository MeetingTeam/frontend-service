import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Routes, Route } from 'react-router'
import LoginPage from './Pages/Auth/LoginPage.jsx'
import RegisterPage from './Pages/Auth/RegisterPage.jsx'
import ProtectedRouter from './Routers/ProtectedRouter.jsx'
import ZegoMeeting from './Pages/VideoCall/ZegoMeeting.jsx'
import ClientRouter from './Routers/ClientRouter.jsx'
import ChangePasswordPage from './Pages/Auth/ChangePasswordPage.jsx'
import AccountActivationPage from './Pages/Auth/AccountActivationPage.jsx'
import DashboardPage from './Pages/Dashboard/DashboardPage.jsx'

function App() {
  return (
        <BrowserRouter>
            <ToastContainer/>
                <Routes>
                    <Route path="/" element={<DashboardPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/changePassword" element={<ChangePasswordPage/>}/>
                    <Route path="/accountActivation" element={<AccountActivationPage/>}/>
                    <Route path="/videoCall" element={<ProtectedRouter><ZegoMeeting/></ProtectedRouter>}/>
                    <Route path="/*" element={<ProtectedRouter><ClientRouter/></ProtectedRouter>}/>
                </Routes>
        </BrowserRouter>
  )
}

export default App
