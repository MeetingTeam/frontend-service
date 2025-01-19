import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { SnackbarProvider } from 'notistack';
import ProtectedRouter from './Router/ProtectedRouter';
import ClientRouter from './Router/ClientRouter';
import LoginPage from './Page/Login/LoginPage';
import RegisterPage from './Page/Login/RegisterPage';
import ChangePassword from './Page/Login/ChangePassword.js';
import AccountActivation from './Page/Login/AccountActivation.js';
import ZegoMeeting from './Page/VideoCall/ZegoMeeting.js';
import { AWS_REGION, COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from './Util/Constraints.js';
import { amplifyConfig } from './Configs/AmplifyConfig.js';
import { Amplify } from 'aws-amplify';

function App() {
  Amplify.configure(amplifyConfig);
  return (
        <BrowserRouter>
            <SnackbarProvider maxSnack={3}>
                  <Routes>
                      <Route path="/login" element={<LoginPage/>}/>
                      <Route path="/register" element={<RegisterPage/>}/>
                      <Route path="/changePassword" element={<ChangePassword/>}/>
                      <Route path="/accountActivation" element={<AccountActivation/>}/>
                      <Route path="videoCall" element={<ZegoMeeting/>}/>
                      <Route path="/*" element={<ProtectedRouter><ClientRouter/></ProtectedRouter>}/>
                  </Routes>
            </SnackbarProvider>
        </BrowserRouter>
  );
}

export default App;
