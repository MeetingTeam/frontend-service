import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const AddUserInfoPage=({email})=>{
          const navigate = useNavigate();
          const { enqueueSnackbar } = useSnackbar();
          const [userDTO, setUserDTO] = useState({
                    nickName: "",
                    birthday: null,
                    gender: true
          });
          const handleChangeValue=(e)=>{
                    const newDTO={...userDTO};
                    if(e.target.name==="gender")
                      newDTO["gender"]=(e.target.value=="male");
                    else newDTO[e.target.name]=e.target.value;
                    setSignUpDto(newDTO);
          }
          const onSubmit=()=>{

          }
          return(
                    <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5">Fill in General Info</h3>
                            <div>
                              <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingNickName" name="nickName" placeholder="nickName"
                                        onChange={(e)=>handleChangeValue(e)}/>
                                <label htmlFor="floatingNickName">Nick Name</label>
                              </div>
                              <div className="form-floating mb-3">
                                <select id="floatingGender" className="form-control" name="gender"
                                        onChange={(e) => handleChangeValue(e)}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                </select>
                                <label htmlFor="floatingGender">Gender</label>
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