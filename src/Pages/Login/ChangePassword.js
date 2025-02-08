import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbarUtil } from "../../Utils/SnackbarUtil.js";
import { Auth } from "aws-amplify";
import { handleAmplifyError } from "../../Utils/ErrorUtil.js";

const ChangePassword=()=>{
          const navigate = useNavigate();
          const { showSuccessMessage, showErrorMessage } = useSnackbarUtil();
          const [changePasswordDTO, setChangePasswordDTO]=useState({
              email:"",
              password:"",
              confirmPassword:"",
              OTPcode:""
          });
          const [error,setError]=useState({ txtEmail: null, txtPassword: null,txtConfirmPassword:null, txtOTP:null});
          
          const handleChangeValue=(e)=>{
            const newDTO={...changePasswordDTO};
            newDTO[e.target.name]=e.target.value;
            setChangePasswordDTO(newDTO);
          }
          function handleOTPbutton(){
              if (changePasswordDTO.email.trim().length == 0) {
                setError({txtEmail:"Email is required"});
              }
              Auth.forgotPassword(changePasswordDTO.email)
                .then(()=>showSuccessMessage("Send OTP code successfully"))
                .catch(err=>setError({
                    txtOTP: handleAmplifyError(err)
                }));
          }
          function validateChangePasswordDTO(changePasswordDTO){
            let txtEmail=null, txtPassword=null, txtConfirmPassword=null, txtOTP=null;
            if (changePasswordDTO.email.trim().length == 0) {
                txtEmail = "Email is required";
            } 
            if(changePasswordDTO.OTPcode.trim().length==0){
              txtOTP="OTP is required";
            }
            if (changePasswordDTO.password.trim().length == 0) {
                txtPassword = "Password is required";
            } 
            if(changePasswordDTO.confirmPassword!=changePasswordDTO.password){
              txtConfirmPassword="Confirm password is mismatched with password"
            }
            setError({txtEmail: txtEmail, txtPassword: txtPassword,txtConfirmPassword:txtConfirmPassword, txtOTP:txtOTP})
            return !(txtEmail||txtPassword||txtConfirmPassword||txtOTP);
          }
          function onSubmit(){
            if(validateChangePasswordDTO(changePasswordDTO)){
              Auth.forgotPasswordSubmit(changePasswordDTO.email, changePasswordDTO.OTPcode, changePasswordDTO.password)
                .then(res=>{
                  showSuccessMessage('Change password successfully');
                  navigate("/login");
                })
                .catch(err=>setError(
                  { txtOTP: handleAmplifyError(err) }
                ));
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
                                        <input type="email" className="form-control" id="floatingInput" name="email" onChange={(e)=>handleChangeValue(e)} placeholder="email"/>
                                        <label htmlFor="floatingInput">Email</label>
                                        <div style={error.txtEmail ? { display: ''} : { display: 'none' }} className="error">{error.txtEmail}</div>
                              </div>
                              <div className="mb-3">
                                  <div className="input-group">
                                        <input type="text" className="form-control" name="OTPcode" placeholder="Enter OTP code" onChange={(e)=>handleChangeValue(e)}/>
                                        <button className="btn btn-success" id="otp" onClick={handleOTPbutton}>Send OTP code</button>
                                  </div>
                                  <div style={error.txtOTP ? { display: ''} : { display: 'none' }} className="error">{error.txtOTP}</div>
                              </div>
                              <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" name="password" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                        <label htmlFor="floatingPassword">New password</label>
                                        <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtPassword}</div>
                              </div>
                              <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingConfirmPassword" name="confirmPassword" onChange={(e)=>handleChangeValue(e)} placeholder="confirm password"/>
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