import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { SnackbarProvider } from 'notistack';
import LoginPage from './Pages/Login/LoginPage';
import RegisterPage from './Pages/Login/RegisterPage';
import ChangePassword from './Pages/Login/ChangePassword.js';
import AccountActivation from './Pages/Login/AccountActivation.js';
import ProtectedRouter from './Routers/ProtectedRouter.js';
import ClientRouter from './Routers/ClientRouter.js';
import { ToastContainer } from 'react-toastify';
import ZegoMeeting from './Pages/VideoCall/ZegoMeeting.js';
import { configAmplify } from './Configs/AmplifyConfig.js';

// Update some thing
function App() {
  configAmplify(true);
  return (
        <BrowserRouter>
            <ToastContainer/>
            <SnackbarProvider maxSnack={3}>
                  <Routes>
                      <Route path="/login" element={<LoginPage/>}/>
                      <Route path="/register" element={<RegisterPage/>}/>
                      <Route path="/changePassword" element={<ChangePassword/>}/>
                      <Route path="/accountActivation" element={<AccountActivation/>}/>
                      <Route path="/videoCall" element={<ProtectedRouter><ZegoMeeting/></ProtectedRouter>}/>
                      <Route path="/*" element={<ProtectedRouter><ClientRouter/></ProtectedRouter>}/>
                  </Routes>
            </SnackbarProvider>
        </BrowserRouter>
  );
}

export default App;
