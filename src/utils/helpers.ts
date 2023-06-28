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
          regno: vehicleRegNo,
          idtype: idType,
          idvalue: idNumber,
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
      throw {
        code: "101",
        message: "Session Expired",
      };
    }
    if (response.data.result) {
      if (response.data.result.errors) {
        if (!response.data.result.errors[0]) {
          throw {
            code: 102,
            message: response.data.result.errors.message.replace(
              /<[^<>]+>/g,
              response.data.result.prevPolExpiryDate
            ),
          };
        }
        if (response.data.result.errors[0] === "Data not found.") {
          throw {
            code: 104,
            message:
              "No vehicle is found with the given request. Make sure vehicle registration no is entered correctly.",
          };
        } else {
          throw {
            code: 103,
            message:
              "Make sure vehicle registration no. or Identity no. are entered correctly.",
          };
        }
      }
      return response.data.result;
    }
    throw {
      code: 105,
      message:
        "Sorry, we're having  too many request at the moment. Please try again later.",
    };
  } catch (err) {
    throw err;
  }
}

// export async function checkPostalCode(postalCode: string, sessionName: string) {
//   try {
//     const apiResponse = await axios.post(
//       "https://app.agiliux.com/aeon/webservice.php",
//       {
//         operation: "checkPostCode",
//         sessionName: sessionName,
//         element: JSON.stringify({
//           postalcode: postalCode,
//           tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
//         }),
//       }
//     );

//   } catch (err) {
//     throw err;
//   }
// }

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
