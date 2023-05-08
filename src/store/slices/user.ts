import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type UserId = {
  type: string | null;
  no: string;
};

type UserState = {
  id: UserId;
  name: string;
  maritalStatus: string | null;
  gender: "male" | "female";
  mobileNumber: string;
  email: string;
  postalCode: string;
  dateOfBirth: string | null;
  drivingExp: string;
  address: {
    city: string | null;
    nationality: string | null;
    state: string | null;
    residence: string;
  };
};

const initialState: UserState = {
  id: {
    type: null,
    no: "",
  },
  name: "",
  maritalStatus: null,
  gender: "male",
  mobileNumber: "",
  email: "",
  postalCode: "",
  dateOfBirth: null,
  drivingExp: "",
  address: {
    city: null,
    nationality: null,
    state: null,
    residence: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserId: (state, action: PayloadAction<UserId>) => {
      const { no, type } = action.payload;
      if (no) {
        state.id.no = no;
      }
      if (type) {
        state.id.type = type;
      }
    },
    updateUserState: (
      state,
      action: PayloadAction<{
        maritalStatus: string | null;
        gender?: "male" | "female";
        mobileNumber: string;
        email: string;
        postalCode: string;
        dateOfBirth?: string | null;
      }>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const getInsuranceInfo = (state: RootState) => state.insurance;

export const { updateUserId, updateUserState } = userSlice.actions;

export default userSlice.reducer;
