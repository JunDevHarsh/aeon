import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type TokenType = {
  token: string;
  serverTime: number;
  expireTime: number;
};

type SessionType = {
  sessionName: string;
  userId: string;
};

type CredentialsStateType = {
  TOKEN: TokenType | null;
  SESSION: SessionType | null;
};

const initialState: CredentialsStateType = {
  TOKEN: null,
  SESSION: null,
};

export const credentialSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    updateTokenAndSession: (
      state,
      action: PayloadAction<{
        token: string;
        serverTime: number;
        expireTime: number;
        sessionName: string;
        userId: string;
      }>
    ) => {
      const { token, serverTime, expireTime, sessionName, userId } =
        action.payload;
      state.TOKEN = {
        token,
        serverTime,
        expireTime,
      };
      state.SESSION = {
        sessionName,
        userId,
      };
    },
  },
});

export const getSessionInfo = (state: RootState) => state.credentials.SESSION;

export const getTokenInfo = (state: RootState) => state.credentials.TOKEN;

export const { updateTokenAndSession } = credentialSlice.actions;

export default credentialSlice.reducer;
