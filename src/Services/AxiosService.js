import axios from "axios";
import { alertInfo } from "../Utils/ToastUtil.js";
import CognitoService from "./CognitoService.js";

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
                              }
                    }
                    else return Promise.reject(err);
          }

          
          async get(url, params){
                    console.log("params", params);
                    const accessToken= await CognitoService.getAccessToken();
                    return this.instance.get(url,{
                              headers: { 'Authorization': accessToken },
                              params: params
                    })
          }
          
          async post(url, body, params) {
                    const accessToken= await CognitoService.getAccessToken();
                   return this.instance.post(url, body,{
                                        headers: {
                                                  'Content-Type': 'application/json',
                                                  'Authorization': accessToken
                                        },
                                        params: params
                              });
          }
          
          async put(url, body, params){
                    const accessToken= await CognitoService.getAccessToken();
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
                    const accessToken= await CognitoService.getAccessToken();
                    return this.instance.patch(url,body,{
                              headers: { 
                                        'Content-Type': 'application/json',
                                        'Authorization': accessToken,
                              },
                              params: params
                    })
          }
          
          async delete(url, params){
                    const accessToken= await CognitoService.getAccessToken();
                    return this.instance.delete(url,{
                              headers: { 'Authorization': accessToken },
                              params: params
                    });
          }
}
export default new AxiosService();