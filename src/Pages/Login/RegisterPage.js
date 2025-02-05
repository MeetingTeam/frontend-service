import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useSnackbarUtil } from "../../Util/SnackbarUtil.js";
import UserAPI from "../../APIs/user-service/UserAPI.js";
import ErrorUtil from "../../Util/ErrorUtil.js";

const RegisterPage=()=>{
          const navigate = useNavigate();
          const { showSuccessMessage, showErrorMessage } = useSnackbarUtil();
          const [userDTO, setUserDTO] = useState({
                    email: '',
                    password: '',
                    confirmPassword:'',
                    nickName: '',
                    birthday: null,
                    gender: true
            });
          const [error,setError]=useState({ txtEmail: null, txtPassword: null,txtConfirmPassword:null, txtNickName: null});
          const onSubmit=()=>{
                    let validate = validateData(userDTO);
                    if(validate){
                        console.log("userDto", userDTO)
                        UserAPI.addUser(userDTO).then(res=>{
                          showSuccessMessage('Register new account successfully');
                          navigate("/accountActivation",{ state: { email: userDTO.email } });
                        })
                        .catch((err)=>{
                          showErrorMessage(ErrorUtil.handleAxiosError(err));
                      })
                }
          }
          const validateData = (data) => {
                    let txtEmail=null, txtPassword=null;
                    let txtConfirmPassword=null, txtNickName=null;
                    
                    if (data.email.trim().length == 0) {
                        txtEmail = "Email is required";
                    } 
                    if (data.password.trim().length == 0) {
                        txtPassword = "Password is required";
                    } 
                    if(data.confirmPassword!=data.password){
                      txtConfirmPassword="Confirm password is mismatched with password"
                    }
                    if(data.nickName.trim().length == 0){
                      txtNickName="NickName must not be empty";
                    }
                    setError({
                      txtEmail, 
                      txtPassword,
                      txtConfirmPassword,
                      txtNickName
                    })
                    return !(txtEmail||txtPassword||txtConfirmPassword||txtNickName);
          }
          const handleChangeValue=(e)=>{
                  const newDTO={...userDTO};
                  if(e.target.name==="gender")
                    newDTO["gender"]=(e.target.value=="male");
                  else newDTO[e.target.name]=e.target.value;
                  setUserDTO(newDTO);
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
                              <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingNickName" name="nickName" placeholder="nickName"
                                        onChange={(e)=>handleChangeValue(e)} required/>
                                <label htmlFor="floatingNickName">Nick Name</label>
                                <div style={error.txtNickName ? { display: ''} : { display: 'none' }} className="error">{error.txtNickName}</div>
                              </div>
                              <div className="form-floating mb-3">
                                <select id="floatingGender" className="form-control" name="gender"
                                        onChange={(e) => handleChangeValue(e)}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                </select>
                                <label htmlFor="floatingGender">Gender</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="date" className="form-control" id="floatingBirthday" name="birthday" placeholder="Enter your birthday"
                                    onChange={(e) => handleChangeValue(e)}/>
                                <label htmlFor="floatingBirthday">Birthday</label>
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