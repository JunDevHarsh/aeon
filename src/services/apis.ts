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
};
