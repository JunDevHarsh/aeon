import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type TokenType = {
  token: string;
  serverTime: number;
  expireTime: number;
};

export type SessionType = {
  sessionName: string;
  userId: string;
};

type CredentialsStateType = {
  token: TokenType | null;
  session: SessionType | null;
  requestId: string;
};

const initialState: CredentialsStateType = {
  token: null,
  session: null,
  requestId: "",
};

export const credentialSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<TokenType>) => {
      state.token = action.payload;
    },
    addSessionName: (state, action: PayloadAction<SessionType>) => {
      state.session = action.payload;
    },
    addRequestId: (state, action: PayloadAction<string>) => {
      state.requestId = action.payload;
    },
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
      state.token = {
        token,
        serverTime,
        expireTime,
      };
      state.session = {
        sessionName,
        userId,
      };
    },
  },
});

export const getSessionInfo = (state: RootState) => state.credentials.session;

export const getTokenInfo = (state: RootState) => state.credentials.token;

export const { addToken, addSessionName, addRequestId, updateTokenAndSession } =
  credentialSlice.actions;

export default credentialSlice.reducer;
