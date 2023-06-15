import axios from "axios";
import md5 from "md5";
import { TokenType } from "../store/slices/credentials";

// check if token is expired or not
export function checkTokenIsExpired(token: TokenType) {
  const { expireTime } = token;
  // get current time
  const currentTime = new Date().getTime();
  // compare current time with expire time
  if (currentTime > expireTime * 1000) {
    // token is expired
    return true;
  }
  // token is not expired
  return false;
}

export async function generateToken(
  url: string,
  defaultTimeout: number = 3000
) {
  try {
    const getToken = await axios.get(url, {
      timeout: defaultTimeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (
      getToken.status !== 200 ||
      (getToken.data.result && getToken.data.success !== true)
    ) {
      // throw error if token is not generated
      throw new Error("TOKEN_NOT_GENERATED");
    }
    return getToken.data.result;
  } catch (err: any) {
    throw err;
  }
}

export async function generateSessionName(
  url: string,
  timeout: number = 3000,
  token: string,
  md5Secret: string
) {
  try {
    if (!token || !md5Secret) {
      throw new Error("TOKEN_OR_MD5_SECRET_NOT_FOUND");
    }
    const accessKey: string = md5(token + "bwJrIhxPdfsdialE");
    const response = await axios.post(
      url,
      {
        operation: "login",
        username: "admin",
        accessKey: accessKey,
      },
      {
        timeout: timeout,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (
      response.status !== 200 ||
      (response.data.result && response.data.success !== true)
    ) {
      // throw error if sessionName is not generated
      throw new Error("INVALID_AUTH_TOKEN");
    }
    return response.data.result;
  } catch (err) {
    throw err;
  }
}

export async function getVehicleInfo(
  url: string,
  timeout: number = 3000,
  sessionName: string,
  vehicleRegNo: string,
  idType: string,
  idNumber: string,
  tenantId: string,
  postalCode: string
) {
  try {
    const response = await axios.post(
      url,
      {
        sessionName: sessionName,
        element: JSON.stringify({
          vehregno: vehicleRegNo,
          idtype: idType,
          id_comregno: idNumber,
          postalcode: postalCode,
          tenant_id: tenantId,
        }),
        operation: "getVehicleInfo",
      },
      {
        timeout: timeout,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.status !== 200 || response.data.success !== true) {
      // throw error if sessionName is not generated
      throw new Error("INVALID_SESSIONID");
    }
    if (response.data.result) {
      if (response.data.result.errors) {
        if (response.data.result.errors[0] === "Data not found.") {
          throw new Error("DATA_NOT_FOUND");
        } else {
          throw new Error("INVALID_ID_NUMBER");
        }
      }
      return response.data.result;
    }
    throw new Error("SERVER_ERROR");
  } catch (err) {
    throw err;
  }
}

export async function generateTokenAndSession() {
  try {
    const getToken = await axios.get(
      "https://app.agiliux.com/aeon/webservice.php?operation=getchallenge&username=admin",
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const tokenInfo = getToken.data.result;
    const accessKey = md5(tokenInfo.token + "bwJrIhxPdfsdialE");
    const login = await axios.post(
      "https://app.agiliux.com/aeon/webservice.php",
      {
        operation: "login",
        username: "admin",
        accessKey: accessKey,
      },
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const sessionInfo = login.data.result;
    return {
      tokenInfo: tokenInfo,
      sessionInfo: sessionInfo,
    };
  } catch (err) {
    console.log(err);
    return err;
  }
}
