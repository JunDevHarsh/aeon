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
  referralCode: string;
};

const initialState: UserInfoType = {
  id: {
    type: "NRIC",
    number: "",
  },
  name: "",
  gender: "Male",
  dateOfBirth: null,
  address: {
    address1: "",
  },
  mobileNumber: "",
  email: "",
  city: "",
  state: "",
  postalCode: "",
  maritalStatus: "Single",
  occupation: "Teacher",
  nationality: "Malaysia",
  race: "Chinese",
  sessionName: "",
  requestId: "",
  polEffectiveDate: "",
  polExpiryDate: "",
  drivingExp: "",
  referralCode: "",
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
    addReferralCode: (state, action: PayloadAction<string>) => {
      state.referralCode = action.payload;
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
  addReferralCode
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
