export const Apis = {
  // generate token api
  generateToken: {
    method: "GET",
    url: "?operation=getchallenge&username=admin",
    headers: {
      "Content-Type": "application/json",
    },
  },
  // generate session api
  generateSession: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      operation: "login",
      username: "admin",
      accessKey: "",
    },
  },
  getPostalCode: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      operation: "checkPostCode",
      sessionName: "",
      element: {
        postalcode: "",
        tenant_id: "",
      },
    },
  },
  getVehicleDetails: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      sessionName: "",
      element: {
        regno: "",
        idtype: "",
        idvalue: "",
        postalcode: "",
        tenant_id: "",
      },
      operation: "getVehicleInfo",
    },
  },
  createInquiry: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      operation: "createInquiry",
      sessionName: "",
      element: {
        tenant_id: "",
        contractNumber: "",
        requestId: "",
        phone: "",
        email: "",
        idvalue: "",
        dob: "",
        idtype: "",
        gender: "",
        maritalstatus: "",
        postalcode: "",
        class: "Private Vehicle",
        periodfrom: "",
        periodto: "",
        regno: "",
        vehiclemake: "",
        vehiclemodel: "",
        engineno: "",
        enginecc: "",
        seatno: "",
        ncd: "",
        yearmanufacture: "",
        chasisno: "",
        region: "",
        variant: "",
        suminsured: "",
        referalcode: "",
      },
    },
  },
  checkReferralCode: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      operation: "checkReferal",
      sessionName: "",
      element: {
        tenant_id: "",
        referalcode: "",
      },
    },
  },
  generateQuotation: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      operation: "getQuoteInfo",
      sessionName: "",
      element: {
        tenant_id: "",
        requestId: "",
        class: "Private Vehicle",
        suminsured: "",
      },
    },
  },
  updateQuotationPremium: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      operation: "updateQuote",
      sessionName: "",
      element: {
        requestId: "",
        tenant_id: "",
        class: "Private Vehicle",
        additionalCover: [],
        unlimitedDriverInd: "",
        driverDetails: [],
        sitype: "",
        avCode: "",
        sumInsured: "",
        nvicCode: "",
        accountid: "",
        inquiryId: "",
        insurer: "",
        productid: "",
        quoteId: "",
        vehicleId: "",
        roadtax: "",
        promoid: "",
        promocode: "",
        percent_off: "",
      },
    },
  },
  validatePromoCode: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      sessionName: "",
      element: {
        tenant_id: "",
        requestId: "",
        promocode: "",
      },
      operation: "checkPromo",
    },
  },
  updateInsured: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      sessionName: "",
      element: {
        requestId: "",
        tenant_id: "",
        name: "",
        nationality: "",
        race: "",
        occupation: "",
        driving_exp: "",
        address_1: "",
        address_3: "",
        state: "",
        city: "",
        accountid: "",
      },
      operation: "updateInsured",
    },
  },
  getAgreedVariantList: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      sessionName: "",
      element: {
        requestId: "",
        tenant_id: "",
        region: "",
        makeCode: "",
        modelCode: "",
        makeYear: ""
      },
      operation: "getVariant",
    },
  },
  getPaymentConfig: {
    method: "POST",
    url: "",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      sessionName: "",
      element: {
        tenant_id: "",
      },
      operation: "paymentConfig",
    },
  }
};
