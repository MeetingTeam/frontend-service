import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./User.css";
import { alertError, alertSuccess } from "../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import UserAPI from "../../APIs/user-service/UserAPI.js";
import MediaFileAPI from "../../APIs/chat-service/MediaFileAPI.js";
import { loadUser } from "../../Redux/userReducer.js";
import DisplayAvatar from "./Components/DisplayAvatar.js";

const UserSettings=()=>{
          const user=useSelector(state=>state.user);
          const dispatch=useDispatch();
          const [updatedUser, setUpdatedUser]=useState({});
          const [file, setFile]=useState(null);
          
          function handleOnChange(e, fieldName){
                    setUpdatedUser(prev=>{
                        if(fieldName=="gender") prev["gender"]=(e.target.value=="male");
                        else prev[fieldName]=e.target.value;
                        return prev;
                    });
          }
          function handlePhoneKeyPress(e){
                    if (e.which < 48 || e.which > 57) {
                              e.preventDefault();
                    }
          }
          function handleSubmit(e){
                    e.preventDefault();
                    if(file!=null){
                        MediaFileAPI.uploadFileToS3(file).then(fileUrl=>{
                            const dto= {...updatedUser};
                            dto.urlIcon=fileUrl;
                            UserAPI.updateUser(dto)
                                .then(res=>{
                                    dispatch(loadUser(res.data));
                                    alertSuccess('Update profile successfully');
                                })
                                .catch(err=>alertError(handleAxiosError(err)));
                        })
                    }
                    else{
                        UserAPI.updateUser(updatedUser)
                                .then(res=>{
                                    dispatch(loadUser(res.data));
                                    alertSuccess('Update profile successfully');
                                })
                                .catch(err=>alertError(handleAxiosError(err)));
                    }
          }
          
          return(
                 <div className="px-lg-5 mx-lg-5">
                    <div className="px-lg-5 mx-lg-5">
                                <div className="my-5">
                                    <h3>My Profile</h3><hr/>
                                </div>
                                <form className="file-upload">
                                    <div className="row mb-5 gx-5">
                                        <div className="col-xxl-8 mb-5 mb-xxl-0">
                                            <div className="bg-secondary-soft px-4 py-5 rounded">
                                                <div className="row g-3">
                                                    <h4 className="mb-1 mt-0">Contact detail</h4>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Nick Name</label>
                                                        <input type="text" className="form-control" defaultValue={user.nickName} onChange={(e)=>handleOnChange(e,"nickName")}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputEmail" className="form-label">Email</label>
                                                        <input type="email" className="form-control" id="inputEmail" defaultValue={user.email} onChange={(e)=>handleOnChange(e,"email")} disabled/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Phone number</label>
                                                        <input type="text" className="form-control" defaultValue={user.phoneNumber} onChange={(e)=>handleOnChange(e,"phoneNumber")} onKeyPress={(e)=>handlePhoneKeyPress(e)}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Birthday</label>
                                                        <input type="date" className="form-control" defaultValue={user.birthday} onChange={(e)=>handleOnChange(e,"birthday")}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Gender</label>
                                                        <select id="floatingGender" className="form-control" onChange={(e) => handleOnChange(e, "gender")}>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4">
                                            <div className="bg-secondary-soft px-4 py-4 rounded">
                                                <div className="row g-3">
                                                    <h4 className="mb-1">Upload your profile photo</h4>
                                                    <div className="text-center">
                                                        <div className="square position-relative display-2 mb-3">
                                                            <DisplayAvatar user={user} file={file}/> 
                                                        </div>
                                                        <input type="file" id="customFile" name="file" hidden="" onChange={(e)=>setFile(e.target.files[0])} style={{display: 'none'}}/>
                                                        <label className="btn btn-success-soft btn-block" htmlFor="customFile">Upload</label>
                                                        <p className="text-muted mt-2 mb-0"><span className="me-1">Note:</span>Minimum size 300px x 300px</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gap-3 d-md-flex justify-content-md-end text-center">
                                        <button type="button" className="btn btn-primary" onClick={(e)=>handleSubmit(e)}>Update profile</button>
                                    </div>
                            </form>
                    </div>
                </div>
          )
}
export default UserSettings;