import { Amplify } from "aws-amplify";
import env from "react-dotenv"

const { AWS_REGION, COGNITO_USER_POOL_ID, 
          COGNITO_CLIENT_ID } = env

export function configAmplify(useLocalStorage) {
          Amplify.configure({
                    Auth: {
                              region: AWS_REGION,
                              userPoolId: COGNITO_USER_POOL_ID,
                              userPoolWebClientId: COGNITO_CLIENT_ID,
                              storage: useLocalStorage ? window.localStorage:window.sessionStorage 
                    }
          });
}