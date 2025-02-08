import env from "react-dotenv"

const { AWS_REGION, COGNITO_USER_POOL_ID, 
          COGNITO_CLIENT_ID } = env

export const amplifyConfig={
          Auth: {
                    region: AWS_REGION,
                    userPoolId: COGNITO_USER_POOL_ID,
                    userPoolWebClientId: COGNITO_CLIENT_ID,
          }
}