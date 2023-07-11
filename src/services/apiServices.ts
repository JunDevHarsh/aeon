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
          if(responseData.result.errors[0] === "We are sorry. You are not eligible to purchase this product due to invalid age."){
            error.code = "121";
            error.message =
              "We are sorry. You are not eligible to purchase this product due to invalid age.";
            throw error;
          }else if (responseData.result.errors[0] === "Data not found.") {
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
  dob: string,
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
          phone: "+60" + phone,
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
    error.code = "404";
    error.message =
      "Sorry, we're having  too many request at the moment. Please try again later.";
    throw error;
  } catch (err: any) {
    throw err;
  }
}

export async function checkReferralCode(
  sessionName: string,
  referralCode: string
) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.checkReferralCode.method,
      url: Apis.checkReferralCode.url,
      headers: Apis.checkReferralCode.headers,
      data: {
        ...Apis.checkReferralCode.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.checkReferralCode.body.element,
          tenant_id: TENANT_ID,
          referalcode: referralCode,
        }),
      },
    });
    if (response.status === 200) {
      if (response.data.success) {
        return response.data.result;
      }
      error.code = "114";
      error.message =
        "Sorry, we're unable to process your request at the moment. Please try again later.";
    }
    error.code = "113";
    error.message =
      "Sorry, we're having  too many request at the moment. Please try again later.";
    throw error;
  } catch (err: any) {
    throw err;
  }
}

export async function generateQuotation(
  sessionName: string,
  sumInsured: string,
  requestId: string
) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.generateQuotation.method,
      url: Apis.generateQuotation.url,
      headers: Apis.generateQuotation.headers,
      data: {
        ...Apis.generateQuotation.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.generateQuotation.body.element,
          tenant_id: TENANT_ID,
          requestId: requestId,
          suminsured: sumInsured,
        }),
      },
    });
    if (response.status === 200) {
      const responseData = response.data;
      if (responseData.success) {
        if (responseData.result.quoteinfo.length !== 0) {
          return responseData.result;
        }
        error.code = "116";
        error.message = "NO_QUOTE_FOUND";
        throw error;
      }
      error.code = "115";
      error.message =
        "Sorry, we're unable to process your request at the moment. Please try again later.";
      throw error;
    }
    error.code = "404";
    error.message =
      "Sorry, we're unable to process your request at the moment. Please try again later.";
    throw error;
  } catch (err: any) {
    throw err;
  }
}

export async function updateQuotationPremium(
  sessionName: string,
  requestId: string,
  additionalCover: any[],
  unlimitedDriverInd: "true" | "false",
  driverDetails: any[],
  siType: "MV - Market Value" | "AV - Agreed Value",
  avCode: string,
  sumInsured: string,
  nvicCode: string,
  accountId: string,
  inquiryId: string,
  productId: string,
  quoteId: string,
  vehicleId: string,
  roadTax: string,
  promoId: string,
  promoCode: string,
  percentOff: string
) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.updateQuotationPremium.method,
      url: Apis.updateQuotationPremium.url,
      headers: Apis.updateQuotationPremium.headers,
      data: {
        ...Apis.updateQuotationPremium.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.updateQuotationPremium.body.element,
          tenant_id: TENANT_ID,
          requestId: requestId,
          additionalCover: additionalCover,
          unlimitedDriverInd: unlimitedDriverInd,
          driverDetails: driverDetails,
          sitype: siType,
          avCode: avCode,
          sumInsured: sumInsured,
          nvicCode: nvicCode,
          accountid: accountId,
          inquiryId: inquiryId,
          insurer: "7x250468",
          productid: productId,
          quoteId: quoteId,
          vehicleId: vehicleId,
          roadtax: roadTax,
          promoid: promoId,
          promocode: promoCode,
          percent_off: percentOff,
        }),
      },
    });
    if (response.status === 200) {
      if (response.data.success) {
        return response.data.result;
      }
      error.code = "118";
      error.message =
        "Sorry, we're unable to process your request at the moment. Please try again later.";
      throw error;
    } else {
      error.code = "404";
      error.message =
        "Sorry, we're unable to process your request at the moment. Please try again later.";
      throw error;
    }
  } catch (err: any) {
    throw err;
  }
}

export async function validatePromoCode(
  sessionName: string,
  requestId: string,
  promoCode: string
) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.validatePromoCode.method,
      url: Apis.validatePromoCode.url,
      headers: Apis.validatePromoCode.headers,
      data: {
        ...Apis.validatePromoCode.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.validatePromoCode.body.element,
          tenant_id: TENANT_ID,
          requestId: requestId,
          promocode: promoCode,
        }),
      },
    });

    if (response.status === 200) {
      if (response.data.success) {
        return response.data.result;
      }
      error.code = "119";
      error.message =
        "Sorry, we're unable to process your request at the moment. Please try again later.";
      throw error;
    }
    error.code = "404";
    error.message =
      "Sorry, we're unable to process your request at the moment. Please try again later.";
  } catch (err: any) {
    throw err;
  }
}

export async function updateInsured(
  sessionName: string,
  requestId: string,
  name: string,
  email: string,
  phone: string,
  nationality: any,
  race: any,
  occupation: any,
  occupationOthers: any,
  drivingExp: any,
  address1: any,
  address2: any,
  address3: any,
  state: any,
  city: any,
  accountId: any,
  postalCode: any
) {
  try {
    let error: any = {};
    const response = await apiInstance({
      method: Apis.updateInsured.method,
      url: Apis.updateInsured.url,
      headers: Apis.updateInsured.headers,
      data: {
        ...Apis.updateInsured.body,
        sessionName: sessionName,
        element: JSON.stringify({
          ...Apis.updateInsured.body.element,
          tenant_id: TENANT_ID,
          requestId: requestId,
          name: name,
          nationality: nationality,
          race: race,
          occupation: occupation,
          occupation_others: occupationOthers,
          driving_exp: drivingExp,
          email: email,
          phone: "+60" + phone,
          address_1: address1,
          address_2: address2,
          address_3: address3,
          state: state,
          city: city,
          postalcode: postalCode,
          accountid: accountId,
        }),
      },
    });

    if (response.status === 200) {
      if (response.data.success) {
        return response.data.result;
      }
      error.code = "120";
      error.message =
        "Sorry, we're unable to process your request at the moment. Please try again later.";
      throw error;
    }
    error.code = "404";
    error.message =
      "Sorry, we're unable to process your request at the moment. Please try again later.";
  } catch (err: any) {
    throw err;
  }
}
