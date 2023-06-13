import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type UserInfoType = {
  id: {
    type: string | null;
    number: string;
  };
  name: string;
  gender: string | null;
  dateOfBirth: Date | null;
  maritalStatus: string | null;
  occupation: string | null;
  mobileNumber: string;
  email: string;
  address: {
    address1: string;
    address2?: string;
    address3?: string;
  };
  city: string;
  state: string;
  postalCode: string;
  race: string | null;
  nationality: string | null;
  sessionName: string;
  requestId: string;
  polEffectiveDate: string;
  polExpiryDate: string;
  drivingExp: string;
};

const initialState: UserInfoType = {
  id: {
    type: "NRIC",
    number: "580127035192",
  },
  name: "",
  gender: "Male",
  dateOfBirth: null,
  address: {
    address1: "",
  },
  mobileNumber: "12312323",
  email: "askjdkh@sad.com",
  city: "",
  state: "",
  postalCode: "",
  maritalStatus: "Single",
  occupation: "Teacher",
  nationality: "Malaysia",
  race: "Chinese",
  sessionName: "787ce1486488125caadb5",
  requestId: "",
  polEffectiveDate: "",
  polExpiryDate: "",
  drivingExp: "",
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: initialState,
  reducers: {
    // it will update the user ID field
    addUserID: (state, action: PayloadAction<UserInfoType["id"]>) => {
      const { number, type } = action.payload;
      state.id = {
        number,
        type,
      };
    },
    // it will update the basic user state's properties
    addUserBasicInfo: (state, action: PayloadAction<Partial<UserInfoType>>) => {
      return { ...state, ...action.payload };
    },
    // update user state
    updateUserStateInfo: (
      state,
      action: PayloadAction<Partial<UserInfoType>>
    ) => {
      return { ...state, ...action.payload };
    },
    updateAPIcredentials: (
      state,
      action: PayloadAction<{ requestId: string; sessionName: string }>
    ) => {
      const { payload } = action;
      state.sessionName = payload.sessionName;
      state.requestId = payload.requestId;
    },
  },
});

export const getUserInfo = (state: RootState) => state.user;

export const {
  addUserBasicInfo,
  addUserID,
  updateUserStateInfo,
  updateAPIcredentials,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
