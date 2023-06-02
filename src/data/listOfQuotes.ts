export type InsurerQuoteType = {
  id: string;
  insurerId: string;
  insurerName: string;
  planType: string;
  imgUrl: string;
  price: number;
  popular: boolean;
  benefits: string[];
};

export const listOfQuotes: InsurerQuoteType[] = [
  {
    id: "101",
    insurerId: "1001",
    insurerName: "Allianz",
    planType: "comprehensive",
    imgUrl: "",
    price: 671.67,
    popular: true,
    benefits: [
      "Third party body injury and death",
      "Third party property loss or damage",
      "Driver's Personal Accident",
      "Full special perils",
      "Legal liability to passengers",
      "6 months warranty on repairs",
      "Loss or Damage due to accident",
    ],
  },
  {
    id: "102",
    insurerId: "1002",
    insurerName: "MSIG",
    planType: "comprehensive",
    imgUrl: "",
    price: 671.67,
    popular: false,
    benefits: [
      "Driver's Personal Accident",
      "Legal liability to passengers",
      "6 months warranty on repairs",
      "Loss or Damage due to accident",
    ],
  },
];
