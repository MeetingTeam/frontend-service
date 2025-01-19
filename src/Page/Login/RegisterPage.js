import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar, useSnackbar } from "notistack";
import "./Login.css";
import { registerUser } from "../../API/AuthAPI.js";
import { Auth } from "aws-amplify";
import { useSnackbarUtil } from "../../Util/SnackbarUtil.js";

const RegisterPage=()=>{
          const navigate = useNavigate();
          const { showSuccessMessage, showErrorMessage } = useSnackbarUtil();
          const [signUpDTO, setSignUpDTO] = useState({
                    email: '',
                    password: '',
                    confirmPassword:''
              })
          const [error,setError]=useState({ txtEmail: null, txtPassword: null,txtConfirmPassword:null});
          const onSubmit=()=>{
                    let validate = validateData(signUpDTO);
                    let anchorOrigin = { horizontal: 'center' , vertical: 'bottom'}
                    if(validate){
                        Auth.signUp({
                          username: signUpDTO.email,
                          password: signUpDTO.password
                        }).then(res=>{
                          showSuccessMessage('Register new account successfully');
                          navigate("/accountActivation");
                        })
                        .catch((err)=>{
                          showErrorMessage(err.message);
                      })
                }
          }
          const validateData = (data) => {
                    let txtEmail=null, txtPassword=null, txtConfirmPassword=null;
                    if (data.email.trim().length == 0) {
                        txtEmail = "Email is required";
                    } 
                    if (data.password.trim().length == 0) {
                        txtPassword = "Password is required";
                    } 
                    if(data.confirmPassword!=data.password){
                      txtConfirmPassword="Confirm password is mismatched with password"
                    }
                    setError({txtEmail: txtEmail, txtPassword: txtPassword,txtConfirmPassword:txtConfirmPassword})
                    return !(txtEmail||txtPassword||txtConfirmPassword);
          }
          const handleChangeValue=(e)=>{
                  const newDTO={...signUpDTO};
                  newDTO[e.target.name]=e.target.value;
                  setSignUpDTO(newDTO);
          }
          return(
                    <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5">Register new account</h3>
                            <div>
                              <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" name="email" onChange={(e)=>handleChangeValue(e)} placeholder="email"/>
                                <label htmlFor="floatingInput">Email address</label>
                                <div style={error.txtEmail ? { display: ''} : { display: 'none' }} className="error">{error.txtEmail}</div>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" name="password" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                <label htmlFor="floatingPassword">Password</label>
                                <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtPassword}</div>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingConPass" name="confirmPassword" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                <label htmlFor="floatingConPass">Confirm Password</label>
                                <div style={error.txtConfirmPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtConfirmPassword}</div>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={()=>onSubmit()}>Register</button>
                                
                                  <div className="contentCenter">
                                        Have an account? <Link to="/login">Sign in</Link>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          )
}
export default RegisterPage;