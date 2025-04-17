import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import {Auth} from "@aws-amplify/auth";
import { handleAmplifyError } from "../../Utils/ErrorUtil.js";
import { alertError, alertSuccess } from "../../Utils/ToastUtil.js";
import { configAmplify } from "../../Configs/AmplifyConfig.js";

const LoginPage=()=>{
          const navigate = useNavigate();
          const [form, setForm] = useState({
                    email: '',
                    password: ''
                });
          const [rememberMe, setRememberMe]= useState(true);
          const [error,setError]=useState({ txtEmail: false, txtPassword: false });
          
          function onSubmit() {
                    let validate = validateData(form)
                    if(validate){
                      console.log("remeberMe", rememberMe)
                      configAmplify(rememberMe);
                      Auth.signIn(form.email, form.password).then(user=>{
                        alertSuccess('Login successfully');
                        navigate("/friendsPage");
                      })
                      .catch(err=>{
                          alertError(handleAmplifyError(err));
                      })
                }
          }
          function handleChangeValue(e) {
                    let name = e.target.name;
                    let value = e.target.value;
                    if (name == 'email') {
                        setForm({ ...form, email: value })
                    }
                    if (name == 'password') {
                        setForm({ ...form, password: value })
                    }
                }
          function validateData(data) {
                    let isValid = true;
                    let txtEmail, txtPassword;
                    if (data.email.trim().length == 0) {
                        txtEmail = true;
                        isValid = false;
                    } else {
                        txtEmail = false;
                    }
                    if (data.password.trim().length == 0) {
                        isValid = false;
                        txtPassword = true;
                    } else {
                        txtPassword = false;
                    }
                    setError({ ...error, txtEmail: txtEmail, txtPassword: txtPassword })
                    return isValid;
          }
          
          return(
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5">Sign In</h3>
                            <div>
                              <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" name="email" onChange={(e)=>handleChangeValue(e)} placeholder="email"/>
                                <label htmlFor="floatingInput">Email address</label>
                                <div style={error.txtEmail ? { display: ''} : { display: 'none' }} className="error">
                                    Email is required
                                </div>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" name="password" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                <label htmlFor="floatingPassword">Password</label>
                                <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">
                                        Password is required
                              </div>
                              <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" defaultChecked={rememberMe} onClick={e=>setRememberMe(e.target.checked)} id="rememberMeCheck"/>
                                <label className="form-check-label" htmlFor="rememberMeCheck">Remember Me</label>
                              </div>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={()=>onSubmit()}>Sign in</button>
                              </div>
                              </div>
                                  <div className="contentAlignment">
                                        <Link to="/register">Register new account</Link>
                                        <Link to="/changePassword">Forgot password</Link>
                                  </div>
                              </div>
                            </div>
                        </div>
                    </div>
                  </div>
          )
}
export default LoginPage;