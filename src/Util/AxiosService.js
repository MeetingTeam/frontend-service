import axios from "axios";
import { ACCESS_TOKEN } from "./Constraints.js";

class AxiosService{
          constructor(){
                    const instance=axios.create();
                    instance.interceptors.response.use(this.handleSuccess, this.handleError);
                    this.instance=instance;
                    this.isTokenExpired=false;
          }
          
          handleSuccess=(res)=>{
                    this.isTokenExpired=false;
                    return res;
          }
          
          handleError=(err)=>{   
                    const res=err.response;         
                    if(res&&res.status==401){
                              if(!this.isTokenExpired){
                                        this.isTokenExpired=true;
                                        window.location.replace("/login");                            
                                        alert("Token has been expired. Please login again");
                              }
                    }
                    else return Promise.reject(err);
          }

          async #getAccessToken() {
                    try{
                              const session = await Auth.currentSession();
                              return session.getAccessToken().getJwtToken();
                    }
                    catch(err){
                              return "";
                    }
          }
          
          async get(url, params){
                    const accessToken= await this.#getAccessToken();
                    return this.instance.get(url,{
                              headers: { 'Authorization': accessToken,
                              params: params
                    }})
          }
          
          async post(url, body, params) {
                    const accessToken= await this.#getAccessToken();
                   return this.instance.post(url, body,{
                                        headers: {
                                                  'Content-Type': 'application/json',
                                                  'Authorization': accessToken
                                        },
                                        params: params
                              });
          }
          
          async put(url, body, params){
                    const accessToken= await this.#getAccessToken();
                    return this.instance.put(url, body,{
                                        headers: { 
                                                  'Content-Type': 'application/json',
                                                  'Authorization': accessToken,
                                        },
                                        params: params
                              }
                    )
          }

          async patch(url, body, params){
                    const accessToken= await this.#getAccessToken();
                    return this.instance.patch(url,body,{
                              headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': accessToken,
                              },
                              params: params
                    })
          }
          
          async delete(url, params){
                    const accessToken= await this.#getAccessToken();
                    return this.instance.delete(url,{
                              headers: { 'Authorization': accessToken },
                              params: params
                    });
          }
}
export default new AxiosService();