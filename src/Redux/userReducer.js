import { createSlice } from "@reduxjs/toolkit";

const userReducer=createSlice({
          name:"user",
          initialState: null,
          reducers:{
                    loadUser:(state, action)=>{
                              const user=action.payload;
                              return user;
                    }
          }
})
export const {loadUser,updateCalendarMeetingIds}=userReducer.actions;
export default userReducer.reducer;