import { Auth } from "aws-amplify";

export async function getAccessToken() {
          try{
                    const session = await Auth.currentSession();
                    return "Bearer "+session.getAccessToken().getJwtToken();
          }
          catch(err){
                    console.log("err", err);
                    return "";
          }
}