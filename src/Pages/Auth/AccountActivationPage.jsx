import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleCognitoError } from "../../Utils/ErrorUtil.js";
import { alertError, alertSuccess } from "../../Utils/ToastUtil.js";
import CognitoService from "../../Services/CognitoService.js";

const AccountActivationPage=()=>{
          const location = useLocation();
          const navigate = useNavigate();
          const passedEmail= location.state?location.state.email:"";
          const [data, setData]=useState({
                    email: passedEmail,
                    OTPcode:""
          })
          const [error, setError]=useState("");
          function handleChangeValue(e, fieldName){
                    setData(prev=>{
                      prev[fieldName]=e.target.value;
                      return prev;
                    });
          }
          function handleOTPbutton(e){
                  if (data.email&&data.email.trim().length == 0) {
                      setError("Email is required");
                  }
                  CognitoService.resendConfirmationCode(data.email)
                    .then(_=> alertSuccess("Send OTP code successfully"))
                    .catch(err=> alertError(handleCognitoError(err)));
          }
          function onSubmit(){
                    CognitoService.confirmSignUp(data.email, data.OTPcode).then(_=>{
                      alertSuccess("Activate account successfully");
                      navigate("/login");
                    })
                    .catch(err=> alertError(handleCognitoError(err)));
          }
          
          return(
                    <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5 fw-light fs-5">Enter email and activate account</h3>
                            <div>
                              <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="floatingInput" placeholder="email" defaultValue={passedEmail} onChange={(e)=>handleChangeValue(e,"email")}/>
                                        <label htmlFor="floatingInput">Email</label>
                              </div>
                              <div className="mb-3">
                                        <div className="input-group">
                                                  <input type="text" className="form-control" placeholder="Enter OTP code" onChange={(e)=>handleChangeValue(e,"OTPcode")}/>
                                                  <button className="btn btn-success" id="otp" onClick={(e)=>handleOTPbutton(e)}>Send OTP code</button>
                                        </div>
                                        <div style={error? { display: ''} : { display: 'none' }} className="error">{error}</div>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={()=>onSubmit()}>Activate account</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          </div>  
          )
}
export default AccountActivationPage;