import axios, { AxiosInstance } from "axios";
import { Session, Token } from "../context/Credential";
import { Apis } from "./apis";
import md5 from "md5";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

const apiInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

export async function checkSession(
  token: Token | null,
  session: Session | null
) {
  try {
    let result: any = {
      token: token,
      session: session,
    };
    // check if token is null it means that token is not generated yet then generate token
    if (token === null || checkTokenIsExpired(token)) {
      // generate token
      const tokenResponse: Token = await generateToken();
      result.token = tokenResponse;
    }
    if (session === null || token === null || checkTokenIsExpired(token)) {
      // generate session
      const sessionResponse: Session = await generateSession(
        result.token.token
      );
      result.session = sessionResponse;
    }
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

// function to generate token
async function generateToken() {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.generateToken.method,
      url: Apis.generateToken.url,
      headers: Apis.generateToken.headers,
    });
    if (response.status === 200) {
      const responseData = response.data;
      if (responseData.success) {
        return responseData.result;
      } else {
        error.code = "101";
        error.message =
          "Sorry, we're having  too many request at the moment. Please try again later.";
        throw error;
      }
    }
    error.code = "102";
    error.message =
      "Sorry, we're having  too many request at the moment. Please try again later.";
    throw error;
  } catch (error: any) {
    throw error;
  }
}

// function to get session
async function generateSession(token: string) {
  try {
    let error: any = {};
    // generate accessKey with md5 encryption
    const md5Secret = import.meta.env.VITE_MD5_SECRET;
    const accessKey = md5(token + md5Secret);
    // generate session
    const response = await apiInstance({
      method: Apis.generateSession.method,
      url: Apis.generateSession.url,
      headers: Apis.generateSession.headers,
      data: {
        ...Apis.generateSession.body,
        accessKey: accessKey,
      },
    });
    if (response.status === 200) {
      const responseData = response.data;
      if (responseData.success) {
        const { sessionName, userId } = responseData.result;
        return {
          sessionName,
          userId,
        };
      } else {
        error.code = "103";
        error.message =
          "Sorry, we're having  too many request at the moment. Please try again later.";
        throw error;
      }
    }
    error.code = "104";
    error.message =
      "Sorry, we're having  too many request at the moment. Please try again later.";
    throw error;
  } catch (error: any) {
    throw error;
  }
}

// check if token is expired or not
export function checkTokenIsExpired(token: Token) {
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

// function to get postalCode
export async function checkPostCode(postalCode: string, sessionName: string) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.getPostalCode.method,
      url: Apis.getPostalCode.url,
      headers: Apis.getPostalCode.headers,
      data: {
        ...Apis.getPostalCode.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.getPostalCode.body.element,
          postalcode: postalCode,
          tenant_id: TENANT_ID,
        }),
      },
    });
    if (response.status === 200) {
      const responseData = response.data;
      if (responseData.success) {
        return responseData.result;
      } else {
        error.code = "105";
        error.message =
          "Sorry, we're having  too many request at the moment. Please try again later.";
        throw error;
      }
    }
    error.code = "106";
    error.message =
      "Sorry, we're having  too many request at the moment. Please try again later.";
    throw error;
  } catch (error: any) {
    throw error;
  }
}

// get vehicle details
export async function getVehicleDetails(
  sessionName: string,
  vehicleNumber: string,
  idType: string,
  idValue: string,
  postalCode: string
) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.getVehicleDetails.method,
      url: Apis.getVehicleDetails.url,
      headers: Apis.getVehicleDetails.headers,
      data: {
        ...Apis.getVehicleDetails.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.getVehicleDetails.body.element,
          regno: vehicleNumber,
          idtype: idType,
          idvalue: idValue,
          postalcode: postalCode,
          tenant_id: TENANT_ID,
        }),
      },
    });
    // if response is 200
    if (response.status === 200) {
      const responseData = response.data;
      if (responseData.success) {
        if (responseData.result.errors) {
          if (!responseData.result.errors[0]) {
            error.code = "111";
            error.message = response.data.result.errors.message.replace(
              /<[^<>]+>/g,
              response.data.result.prevPolExpiryDate
                .split("-")
                .reverse()
                .join("-")
            );
            throw error;
          }
          if (responseData.result.errors[0] === "Data not found.") {
            error.code = "109";
            error.message =
              "No vehicle is found with the given request. Make sure vehicle registration no is entered correctly.";
            throw error;
          } else {
            error.code = "110";
            error.message =
              "Make sure vehicle registration no. or Identity no. are entered correctly.";
            throw error;
          }
        }
        return responseData.result;
      } else {
        error.code = "107";
        error.message =
          "Sorry, we're having  too many request at the moment. Please try again later.";
        throw error;
      }
    }
    error.code = "108";
    error.message =
      "Sorry, we're having  too many request at the moment. Please try again later.";
    throw error;
  } catch (err: any) {
    throw err;
  }
}

export async function createInquiry(
  sessionName: string,
  contractNumber: string,
  requestId: string,
  phone: string,
  email: string,
  idValue: string,
  dob: Date | null,
  idType: string | null,
  gender: string | null,
  maritalStatus: string | null,
  postalCode: string,
  periodFrom: string,
  periodTo: string,
  regNo: string,
  vehicleMake: string,
  vehicleModel: string,
  engineNo: string,
  engineCC: string,
  seatNo: number,
  ncd: number,
  yearOfManufacture: string,
  chassisNo: string,
  region: string,
  variant: string,
  sumInsured: string,
  referalCode: string
) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.createInquiry.method,
      url: Apis.createInquiry.url,
      headers: Apis.createInquiry.headers,
      data: {
        ...Apis.createInquiry.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.createInquiry.body.element,
          tenant_id: TENANT_ID,
          contractNumber: contractNumber,
          requestId: requestId,
          phone: phone,
          email: email,
          idvalue: idValue,
          dob: dob,
          idtype: idType,
          gender: gender,
          maritalstatus: maritalStatus,
          postalcode: postalCode,
          class: "Private Vehicle",
          periodfrom: periodFrom,
          periodto: periodTo,
          regno: regNo,
          vehiclemake: vehicleMake,
          vehiclemodel: vehicleModel,
          engineno: engineNo,
          enginecc: engineCC,
          seatno: seatNo,
          ncd: ncd,
          yearmanufacture: yearOfManufacture,
          chasisno: chassisNo,
          region: region,
          variant: variant,
          suminsured: sumInsured,
          referalcode: referalCode,
        }),
      },
    });
    // if response is 200
    if (response.data.error) {
      error.code = "112";
      error.message =
        "Sorry, we're having  too many request at the moment. Please try again later.";
      throw error;
    }
    if (response.status === 200) {
      const responseData = response.data;
      return responseData.result;
    }
    error.code = "112";
    error.message =
      "Sorry, we're having  too many request at the moment. Please try again later.";
    throw error;
  } catch (err: any) {
    throw err;
  }
}