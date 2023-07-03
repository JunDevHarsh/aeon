import { useState, createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  checkTokenIsExpired,
  generateSessionName,
  generateToken,
  getLovListApi,
} from "../utils/helpers";
import {
  SessionType,
  TokenType,
  addSessionName,
  addToken,
} from "../store/slices/credentials";

export const OptionContext = createContext<{
  occupation: [];
  relationShip: [];
  nationality: [];
}>({
  occupation: [],
  relationShip: [],
  nationality: [],
});

function OptionProvider({ children }: { children: React.ReactNode }) {
  const {
    credentials: { session, token, requestId },
  } = useSelector((state: RootState) => state);

  const updateStore = useDispatch();

  const [state, setState] = useState<{
    relationShip: [];
    occupation: [];
    nationality: [];
  }>({
    relationShip: [],
    occupation: [],
    nationality: [],
  });

  async function getLovlist() {
    try {
      let tokenInfo = token;
      let sessionInfo = session;
      if (!token || checkTokenIsExpired(token)) {
        // get new token
        const getToken: TokenType = await generateToken(
          "https://app.agiliux.com/aeon/webservice.php?operation=getchallenge&username=admin",
          5000
        );
        tokenInfo = getToken;
        // add token to store
        updateStore(addToken({ ...getToken }));
        const sessionApiResponse: SessionType = await generateSessionName(
          "https://app.agiliux.com/aeon/webservice.php",
          5000,
          tokenInfo.token,
          "bwJrIhxPdfsdialE"
        );
        sessionInfo = sessionApiResponse;
        // add session name to store state
        updateStore(
          addSessionName({
            userId: sessionApiResponse.userId,
            sessionName: sessionApiResponse.sessionName,
          })
        );

        const getLovList = await getLovListApi(
          requestId,
          sessionInfo.sessionName
        );
        setState({
          ...state,
          relationShip: getLovList.RELATIONSHIP,
          nationality: getLovList.NATIONALITY,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!state.relationShip.length || !state.nationality.length) {
      getLovlist();
    }
  }, []);

  const { nationality, occupation, relationShip } = state;

  return (
    <OptionContext.Provider value={{ nationality, occupation, relationShip }}>
      {children}
    </OptionContext.Provider>
  );
}

export default OptionProvider;
