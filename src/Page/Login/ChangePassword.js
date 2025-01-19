import { useNavigate } from "react-router-dom";
import { changePassword, sendOTPcode } from "../../API/AuthAPI.js";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSnackbarUtil } from "../../Util/SnackbarUtil.js";
import { Auth } from "aws-amplify";

const ChangePassword=()=>{
          const navigate = useNavigate();
          const { showSuccessMessage, showErrorMessage } = useSnackbarUtil();
          const [data, setData]=useState({
              email:"",
              password:"",
              confirmPassword:"",
              OTPcode:""
          });
          const [error,setError]=useState({ txtEmail: null, txtPassword: null,txtConfirmPassword:null, txtOTP:null});
          function handleChangeValue(e,fieldName){
              setData(prev=>{
                prev[fieldName]=e.target.value;
                return prev;
              });
          }
          function handleOTPbutton(){
              if (data.email.trim().length == 0) {
                setError({txtEmail:"Email is required"});
              }
              Auth.forgotPassword(data.email)
                .then(()=>showSuccessMessage("Send OTP code successfully"))
                .catch(err=>setError({txtOTP:err.response.data}));
          }
          function validateData(data){
            let txtEmail=null, txtPassword=null, txtConfirmPassword=null, txtOTP=null;
            if (data.email.trim().length == 0) {
                txtEmail = "Email is required";
            } 
            if(data.OTPcode.trim().length==0){
              txtOTP="OTP is required";
            }
            if (data.password.trim().length == 0) {
                txtPassword = "Password is required";
            } 
            if(data.confirmPassword!=data.password){
              txtConfirmPassword="Confirm password is mismatched with password"
            }
            setError({txtEmail: txtEmail, txtPassword: txtPassword,txtConfirmPassword:txtConfirmPassword, txtOTP:txtOTP})
            return !(txtEmail||txtPassword||txtConfirmPassword||txtOTP);
        }
          function onSubmit(){
            if(validateData(data)){
              Auth.forgotPasswordSubmit(data.email, data.OTPcode, data.password)
                .then(res=>{
                  showSuccessMessage('Change password successfully');
                  navigate("/login");
                })
                .catch(err=>setError({txtOTP:err.response.data}));
            }
          }
          return(
          <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5 fw-light fs-5">Change Password</h3>
                            <div>
                              <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="floatingInput" name="email" onChange={(e)=>handleChangeValue(e,"email")} placeholder="email"/>
                                        <label htmlFor="floatingInput">Email</label>
                                        <div style={error.txtEmail ? { display: ''} : { display: 'none' }} className="error">{error.txtEmail}</div>
                              </div>
                              <div className="mb-3">
                                  <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Enter OTP code" onChange={(e)=>handleChangeValue(e,"OTPcode")}/>
                                        <button className="btn btn-success" id="otp" onClick={handleOTPbutton}>Send OTP code</button>
                                  </div>
                                  <div style={error.txtOTP ? { display: ''} : { display: 'none' }} className="error">{error.txtOTP}</div>
                              </div>
                              <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" onChange={(e)=>handleChangeValue(e,"password")} placeholder="password"/>
                                        <label htmlFor="floatingPassword">New password</label>
                                        <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtPassword}</div>
                              </div>
                              <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingConfirmPassword" onChange={(e)=>handleChangeValue(e,"confirmPassword")} placeholder="confirm password"/>
                                        <label htmlFor="floatingPassword">Confirm password</label>
                                        <div style={error.txtConfirmPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtConfirmPassword}</div>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={onSubmit}>Change password</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          </div>
          )
}
export default ChangePassword;