import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserBasicInfoInputs, UserIdInputs, UserStateType } from "./types";

const initialState: UserStateType = {
  id: {
    type: "NRIC",
    no: "070212-12-1231",
  },
  name: "Jack",
  maritalStatus: "Single",
  gender: "male",
  mobileNumber: "1123987854",
  email: "jack.123@gmail.com",
  postalCode: "55000",
  dateOfBirth: "2007-02-12T00:00:00.000Z",
  drivingExp: "2",
  address: {
    address1: "",
    address2: "",
    address3: "",
  },
  city: "Kuala Terengganu",
  nationality: "Malaysia",
  state: "Terengganu",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // it will update the user ID field
    addUserID: (state, action: PayloadAction<UserIdInputs>) => {
      const { userIdNo, userIdType } = action.payload;
      state.id = {
        no: userIdNo,
        type: userIdType,
      };
    },
    // it will update the basic user state's properties
    addUserBasicInfo: (state, action: PayloadAction<UserBasicInfoInputs>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const getInsuranceInfo = (state: RootState) => state.insurance;

export const { addUserID, addUserBasicInfo } = userSlice.actions;

export default userSlice.reducer;
