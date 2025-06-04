import { AuthenticationDetails, CognitoUser, 
  CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "../Configs/EnvConfig.js";

class CognitoService {
    constructor(){
        this.configUserPool(false)
    }
    
    configUserPool(useSession = false) {
      this.userPool = new CognitoUserPool({
        UserPoolId: COGNITO_USER_POOL_ID,
        ClientId: COGNITO_CLIENT_ID,
        Storage: useSession ? window.sessionStorage : window.localStorage,
      });
    }
    
    async signUp(username, password, email) {
      return new Promise((resolve, reject) => {
        const attributeList = [
          new CognitoUserAttribute({
            Name: 'email',
            Value: email,
          }),
        ];

        this.userPool.signUp(username, password, attributeList, null, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }

    async resendConfirmationCode(username) {
      const user = new CognitoUser({
        Username: username,
        Pool: this.userPool,
      });

      return new Promise((resolve, reject) => {
        user.resendConfirmationCode((err, result) => {
          if (err) return reject(err);
          resolve(result); 
        });
      });
    }

    async confirmSignUp(username, code) {
      const user = new CognitoUser({ Username: username, Pool: this.userPool });

      return new Promise((resolve, reject) => {
        user.confirmRegistration(code, true, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }
    
    async signIn(username, password) {
      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const user = new CognitoUser({ Username: username, Pool: this.userPool });

      return new Promise((resolve, reject) => {
        user.authenticateUser(authDetails, {
          onSuccess: (result) => {
            resolve({
              idToken: result.getIdToken().getJwtToken(),
              accessToken: result.getAccessToken().getJwtToken(),
              refreshToken: result.getRefreshToken().getToken(),
            });
          },
          onFailure: reject,
        });
      });
    }

    async forgotPassword(username) {
      const user = new CognitoUser({ Username: username, Pool: this.userPool });

      return new Promise((resolve, reject) => {
        user.forgotPassword({
          onSuccess: (data) => resolve(data),
          onFailure: reject,
        });
      });
    }

    async confirmForgotPassword(username, code, newPassword) {
      const user = new CognitoUser({ Username: username, Pool: this.userPool });

      return new Promise((resolve, reject) => {
        user.confirmPassword(code, newPassword, {
          onSuccess: () => resolve(),
          onFailure: reject,
        });
      });
    }

    signOut() {
      const user = this.userPool.getCurrentUser();
      if(user) user.signOut();
    }

    async isTokenValid() {
      const user = this.userPool.getCurrentUser();
      console.log("user", user)

      if (!user) return false; // No user is logged in

      return new Promise((resolve) => {
        user.getSession((err, session) => {
          console.log('session', session)
          if (err || !session || !session.isValid()) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    async getAccessToken() {
      const currentUser = this.userPool.getCurrentUser();

      return new Promise((resolve, reject) => {
        if (!currentUser) return reject(new Error("No user is currently signed in."));

        currentUser.getSession((err, session) => {
          if (err) return reject(err);
          if (!session.isValid()) return reject(new Error("Session is invalid or expired."));
          
          const accessToken = "Bearer "+ session.getAccessToken().getJwtToken();
          resolve(accessToken);
        });
      });
    }
}

export default new CognitoService();