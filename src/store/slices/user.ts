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
    city: "Kuala Terengganu",
    nationality: "Malaysia",
    state: "Terengganu",
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
