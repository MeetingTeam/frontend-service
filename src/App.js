import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { SnackbarProvider } from 'notistack';
import LoginPage from './Pages/Login/LoginPage';
import RegisterPage from './Pages/Login/RegisterPage';
import ChangePassword from './Pages/Login/ChangePassword.js';
import AccountActivation from './Pages/Login/AccountActivation.js';
import { amplifyConfig } from './Configs/AmplifyConfig.js';
import { Amplify } from 'aws-amplify';
import ProtectedRouter from './Routers/ProtectedRouter.js';

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
                      {/* <Route path="videoCall" element={<ZegoMeeting/>}/> */}
                      <Route path="/*" element={<ProtectedRouter><div>Hello</div></ProtectedRouter>}/>
                  </Routes>
            </SnackbarProvider>
        </BrowserRouter>
  );
}

export default App;
