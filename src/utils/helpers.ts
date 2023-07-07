import axios from "axios";
import md5 from "md5";
import { TokenType } from "../store/slices/credentials";

export function SHA256(s: string) {
  var chrsz = 8;
  var hexcase = 0;

  function safe_add(x: any, y: any) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function S(X: any, n: any) {
    return (X >>> n) | (X << (32 - n));
  }
  function R(X: any, n: any) {
    return X >>> n;
  }
  function Ch(x: any, y: any, z: any) {
    return (x & y) ^ (~x & z);
  }
  function Maj(x: any, y: any, z: any) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  function Sigma0256(x: any) {
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
  }
  function Sigma1256(x: any) {
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
  }
  function Gamma0256(x: any) {
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
  }
  function Gamma1256(x: any) {
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
  }

  function core_sha256(m: any, l: any) {
    var K = new Array(
      0x428a2f98,
      0x71374491,
      0xb5c0fbcf,
      0xe9b5dba5,
      0x3956c25b,
      0x59f111f1,
      0x923f82a4,
      0xab1c5ed5,
      0xd807aa98,
      0x12835b01,
      0x243185be,
      0x550c7dc3,
      0x72be5d74,
      0x80deb1fe,
      0x9bdc06a7,
      0xc19bf174,
      0xe49b69c1,
      0xefbe4786,
      0xfc19dc6,
      0x240ca1cc,
      0x2de92c6f,
      0x4a7484aa,
      0x5cb0a9dc,
      0x76f988da,
      0x983e5152,
      0xa831c66d,
      0xb00327c8,
      0xbf597fc7,
      0xc6e00bf3,
      0xd5a79147,
      0x6ca6351,
      0x14292967,
      0x27b70a85,
      0x2e1b2138,
      0x4d2c6dfc,
      0x53380d13,
      0x650a7354,
      0x766a0abb,
      0x81c2c92e,
      0x92722c85,
      0xa2bfe8a1,
      0xa81a664b,
      0xc24b8b70,
      0xc76c51a3,
      0xd192e819,
      0xd6990624,
      0xf40e3585,
      0x106aa070,
      0x19a4c116,
      0x1e376c08,
      0x2748774c,
      0x34b0bcb5,
      0x391c0cb3,
      0x4ed8aa4a,
      0x5b9cca4f,
      0x682e6ff3,
      0x748f82ee,
      0x78a5636f,
      0x84c87814,
      0x8cc70208,
      0x90befffa,
      0xa4506ceb,
      0xbef9a3f7,
      0xc67178f2
    );
    var HASH = new Array(
      0x6a09e667,
      0xbb67ae85,
      0x3c6ef372,
      0xa54ff53a,
      0x510e527f,
      0x9b05688c,
      0x1f83d9ab,
      0x5be0cd19
    );
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;

    for (var i: any = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (var j: any = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else
          W[j] = safe_add(
            safe_add(
              safe_add(Gamma1256(W[j - 2]), W[j - 7]),
              Gamma0256(W[j - 15])
            ),
            W[j - 16]
          );

        T1 = safe_add(
          safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
          W[j]
        );
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }

      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str: any) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
    }
    return bin;
  }

  function Utf8Encode(string: any) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  function binb2hex(binarray: any) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str +=
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

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
      throw {
        code: "201",
        message: "Token not generated",
      };
    }
    return getToken.data.result;
  } catch (err: any) {
    throw err;
  }
}

export async function checkReferralCode(
  url: string,
  timeout: number = 3000,
  sessionName: string,
  referralCode: string
) {
  try {
    const apiResponse = await axios.post(
      url,
      {
        sessionName: sessionName,
        element: JSON.stringify({
          tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
          referalcode: referralCode,
        }),
        operation: "checkReferal",
      },
      {
        timeout: timeout,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (apiResponse.status !== 200 || apiResponse.data.success !== true) {
      throw {
        code: 108,
        message:
          "Can't check referral code at the moment. Please try again later.",
      };
    }
    if (apiResponse.data.result) {
      return apiResponse.data.result;
    }
    throw {
      code: 108,
      message:
        "Can't check referral code at the moment. Please try again later.",
    };
  } catch (err) {
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
      throw {
        code: "202",
        message: "TOKEN_OR_MD5_SECRET_NOT_FOUND",
      };
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
      throw {
        code: "203",
        message: "INVALID_AUTH_TOKEN",
      };
    }
    return response.data.result;
  } catch (err) {
    throw err;
  }
}

export async function checkPromoCode(
  url: string,
  timeout: number = 3000,
  sessionName: string,
  requestId: string,
  promoCode: string
) {
  try {
    const apiResponse = await axios.post(
      url,
      {
        sessionName: sessionName,
        element: JSON.stringify({
          tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
          requestId: requestId,
          promocode: promoCode,
        }),
        operation: "checkPromo",
      },
      {
        timeout: timeout,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (apiResponse.status !== 200 || apiResponse.data.success !== true) {
      throw {
        code: 104,
        message:
          "Not able to process this request at the moment. Please try again later.",
      };
    }
    if (apiResponse.data.result) {
      return apiResponse.data.result;
    }
    throw {
      code: 108,
      message: "Can't check promo code at the moment. Please try again later.",
    };
  } catch (err) {
    throw err;
  }
}

export async function checkPostalCode(
  url: string,
  timeout: number = 3000,
  sessionName: string,
  postalCode: string,
  tenantId: string
) {
  try {
    const response = await axios.post(
      url,
      {
        sessionName: sessionName,
        element: JSON.stringify({
          postalcode: postalCode,
          tenant_id: tenantId,
        }),
        operation: "checkPostCode",
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
        message: "Something went wrong. Please try again later.",
      };
    }
    return response.data.result;
  } catch (err) {
    throw err;
  }
}

export async function getLovListApi(requestId: string, sessionName: string) {
  try {
    const apiResponse = await axios.post(
      "https://app.agiliux.com/aeon/webservice.php",
      {
        sessionName: sessionName,
        element: JSON.stringify({
          tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
          typeList: ["RELATIONSHIP", "NATIONALITY"],
          requestId: requestId,
        }),
        operation: "lovList",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(apiResponse);
    if (apiResponse.status !== 200 || apiResponse.data.success !== true) {
      throw {
        code: 108,
        message: "Can't get lov list at the moment. Please try again later.",
      };
    }
    const result: any = apiResponse.data.result;
    let obj = result.reduce((acc: any, cur: any) => {
      acc[cur.LovType] = cur.LovList;
      return acc;
    }, {});
    return obj;
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
        message: "Something went wrong. Please try again later.",
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
