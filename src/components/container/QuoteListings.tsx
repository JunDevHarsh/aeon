import { useEffect, useState } from "react";
import SelectMultiSearch from "../fields/SelectMultiSearch";
import SelectDropdown from "../fields/SelectDropdown";
import QuoteListingPlanCard from "../card/QuoteListingPlan";
import QuoteComparePopup from "../popup/QuoteCompare";
import DefaultPopup, { WarningPopupType } from "../popup/Default";

type FilterType = {
  sort: string | null;
  type: PlanType[];
};

export interface PlanType {
  value: string;
  label: string;
  isSelected: boolean;
}

export type QuotePlansType = {
  id: string;
  companyId: string;
  companyName: string;
  companyImgHref: string;
  planType: string;
  price: string;
  isTrending: boolean;
  isSelected: boolean;
  coverages: Record<string, Coverage>;
};

export interface Coverage {
  id: string;
  body: string;
}

const defaultQuotePlans: QuotePlansType[] = [
  {
    id: "101",
    companyName: "Allianz",
    companyId: "1001",
    planType: "comprehensive",
    companyImgHref:
      "data:image/png;base64,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",
    price: "609.35",
    isTrending: true,
    isSelected: false,
    coverages: {
      "001": {
        id: "001",
        body: "Third party body injury and death",
      },
      "002": {
        id: "002",
        body: "Third party property loss or damage",
      },
      "003": {
        id: "003",
        body: "Driver's Personal Accident",
      },
      "004": {
        id: "004",
        body: "Full special perils",
      },
      "005": {
        id: "005",
        body: "Legal liability to passengers",
      },
      "006": {
        id: "006",
        body: "6 months warranty on repairs",
      },
      "007": {
        id: "007",
        body: "Loss or Damage due to accident",
      },
    },
  },
  {
    id: "102",
    companyId: "1002",
    companyName: "MSIG",
    planType: "third-party",
    companyImgHref:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWsAAACLCAMAAACQq0h8AAABa1BMVEX///8bFGThHycAAAD8/Pz//v9HR0fGxsaNjY3///309PT5+fmUlJTm5uZQUFBBQUEbE2biHyUbFGHfICgAAFhubm6xsbF3d3fr6+v19fUAAFZaWlrKyso7OzspKSnU1NQiIiIyMjIAFWaAgIC7u7ve3t6goKAUFBSenp7eAAAUC2EAEWjhISLS0tJzc3NmZmbiCxefnLoGAGP0uLNzcZblHCwPDw8bGxvUHiv22NnriYzjXWTnO0TpaWzxqKf32tbrlpbiVFfgNDrtTFTwkJT76uXtg4jeSFDzwb330s/ysrDhOkbIeoyLHUtVU4nMytjrd3ebGE0AFVurHDtzcZTe3uq3HjkyK2/PHTQ6FV+MiqpEFVhYVItWFlpGQHt6GVa1s8tqGVbzHiKoHEbX1OkoIWhGQne/HDWtGzmBGkmoqb3fZXNfGFLlysxNGVjWRFTXkJjWn57RbXe/FCLaqrY9A12VO19aLWVLR4ahZg2CAAATv0lEQVR4nO1di1/TyNpOSwKkpZBJKhQEyq0K7biELpXquiLuckRdxcuiwB4V5Yirezt7vv0uf/4376RNJslMZpKyP9c1z57dA21a0idvn3mvE00bACb8a5qaDj+Vr927/tUNB93/+uY1TddNwxjkrXNEYPSgafr2rZ3OmuuiIsbYvX3LpNchx/nBMEwwa2371jdrLkYdx3GKiPyvuHZPM/SPfXZ/L5ggFKW9rxwXF3ERSAY4xLh3SpqZa8h5AlT61jeui4k9dxyPaUI5LqLb13KuzwN0RdRN0IjtfxCii2EA5w7hOqf6XEC0QydUb1+/TVQaFaNkF5H7Vfljn+PfA2CwsCB+C26H04kwjYieOGRtzCXkPABWbe7+o+MSk0bE7YjBQXd0UzNyr29wAIm3QD2IATtOVEPI0oicbWLWOdWDgfh4xGL1vRtuTKWpfIBNk3/ufuzz/DuARi67j7hME56pC+IQqnObHhwkGDRvOSRsiXsf1LCJZWOw6nxdHBymdnfHxUVHZNfkGoBWm7ldDw7jFsJOh+t89CwbfwmBzsc+z08XkPYggaKh3eWvif1lkUSQQHWOAUDTebpWvtnB1KkTLIskXkT3Pva5fuogRm0Y2u6Ol/rg6wfoCqU6XxYHgkHkw9y77Qq8D39ZdPc0cL9zDABwK77F3oIoWhVJuI5vapqeuyCZAQ41oW97R7QoUvWgQQzeg3xTTnVmQI1W0+7ex0Kqe3wj9zvQ6tyss8MgZGv3kCt0qKkLAgm/B9WH+5AvycnOCmKn5es4WnoJcw0qgt43rXZ1o5wbdnaYkGnCHQcqimKuHfT4iWXZzepm7WOf8CcKXSeCsPuNm6jUnlw/XioQ2Ha7sA9Fgty4U8I0dEO7dsftJC+LsDA+taxCj2x7Q8tLMqkBEczdIk5INPXgni55VBMZKTRnvi/lop0WJATcg7YaYfjSA35q+2YN/22fHeRedkoQXw+jDnHpEr2QIn5mFzyqPcO27Pbz/Y997p8STFgWv1wrSqS6gx332VEhAqtZ3SDrY56EUgKNFr/sJDh6HpCDD6NUUyuvHpfzBVIRhkEEBAtKXSzZhz8sWTG7JvJd/WcNqM4LNFKQSJtoNbQfJFONnRdRontsF6ov//WxP8WnAVPbQxB4S9w9hF4sxXmmOkLcEbJC5pKdCOJVE+/4LonLJepB/nVeLRF3r+/xRdGsnkBUA/MdOedc0LTo9m2k4oI8fmLZtkW8PJtPtrUBiT+oVn7sT/UXhW5qu1DuSqYauhNOWxZ1qJ/YTZFlH+ummRcQRCA2uLtDqJYF5sSxtpaWCvbRkd1qCQzbLrQ3y2Y+ECaEoT9yO8mhIgB3j1ovHj971+2+O/11qcUzbGL1VnWzZGq5XccATajEBq9Lk6gQ4nRfvH6HMfFWEHbwU9tuCWS7/fAAuDZz0Q7BpInnPakLQvH4GcJdKjQIFd+c2oUgKxJG9WENFDtXkjCAj7sdaWIP0MWYuCK9GTsi3qctuyAgu/38gNYPcq4ZwGjX7n3sSNUaeve6yOl3jECLjgMuCZdry26/PMjNOgL4qj9y6XCRhGvqEaKe/YMr7rg/L4moti0ar+d6zYJwfXNNLh9c4MdLfL/Pk5G3JyYM0OQdDX2QeLErDWFEXJ8uWWKy7WZ7n47a5KLdR/kGVlgWuUDP+BLSE5JCs3kCfk6eY+3jVlJ7k4Trp0l2TVS7+XYf3OxcQzzcTRrOkIDodSGBaxsse1/Tc72mCSdDv43ELb8J6BDnD7mvW0kiAqCWbXqlzM8ZsI1NdgUhXiI+kjANZLcbeVMUsWtD2yZRoNSz5gHDVNLhkiiWCXSk2Xy+nydGoELwtVvMxjVYNci1JYjRGdGGcP2zJxtSTlm0usc16r5IWBh7sCCfTcj+jF1scHkNs3xbnrIWAhefxWu8fLTPDiA1YqjVav58d1yP/P/Ab6fH3o39hWaFbrqZ3T1i129ey1fGno60zwxYiPU/hcYUb+qTrKu9To/9ID5I73Meewq43r0hHqeTWrWD38n8PZbsh14fq5qU/O0CTVP7VqGYK+QaOa9VJYQEkIXqJs1mq8p2OYqBD+wfX5u9NEWxfGmlUZpWOgeVM56uXRlbXr9IsT41OlkvwcuoVpMPPh3bjCwFkJPCrMEbqR5rKXyRS8PjIQyXBAeuh48b/yLxbWdHh4dCmBudrAiOrfunMCf/no2MjQ9FcXF0hF5KSAjdVJjT4IJuOIR+XpK5e2Hbrn7Q1PsYRqMnPsk/rhY9biJ+TJ+p8shw9GiKKwL6giMkXFdW57lvPDS0deEK3R5y905GAUGwBSKGFJ/c5WPJbp+oZ6FiXK/zObwUPW6Y/37k2NoFASEV/vqgynV5bEHwxhQrEDJ+mbVCANN2GP/QSkc1wcx+drte5H7VyxdVuKZUzQrZEEyxKXI9InxfDyOwn/JOZglxEEY/QjY1jYZAOvvlgSLVca6JfXBQiZkUh2uP6ssiMuYFS4ES1+UvJFQPzcK2QrLePSFwx3EPX1iiCnoC2e2zpHU/mesLvMMmY4cJNCR+UXyMC85JhesKfwVgUSd6PUCJgCyNj5X9vRCqm4apVBKLcz3EOywmISKu18VkfCFgUoHr+qKU6q2GZpRvSAb7E0D8kNi4jCJmNtRKvRyuR2IH6aWrSlzrUbGeWB4bG7vQs8lRQegk5zrhy+Jjnqwz22uZ4xhUxA+ymTV4fidKIzUcrpfjR8UlRKDXrFnPX/Kpq0wuLwytCk5BynVtLvK3F9fHJkcAk6tT4z0zmCMr7/UBqoyoq1Aj4MNuvVUaXg+43vKNMf7CZf9TJnPdYAxwscFcA6A7/n1R5DriQ46v1JjjSpUV+r0ZntbKOwozSAI47oP4aJIy2psqjl/AdfCJ6tGDSv51CNxsrl6vMJRUNMUUmIzr8JdqnF6y8IGzZDm5qMEMQZauENQhAWPn8MhOKp8ngcQ/7X1NvkAGXI/6ZI9GD/JVeKuezLVv/0NDYyo0UyRwDb+HxXqSnzNZWSBcw2hMFrt2HNzB762sVFMv+0yT368j4HrVt9lFLWI4PoXrpWSumVxF7MshhMSu2RXlMtf5B1QmoSlEOhvDN2zi8B1a0sJXAtdWofovTdoJz3Dd8H+cDR9T8temS+VkroN0xZwo0xRHMtcN1gWqC1wZ79FHWDqey6Xawc6b9y1bVtFNZLt9LN+OK+B6LGBqNWzXgSNXkXAdLJ38UJ+LZK7HGKoFeTE4WXjlDkJZKo1EQhDkUlOmnVimbat5VjNlm5KzXPsfazwsiv7j85pEQwKuFxq857lI5FpnQv4pcXGDVmqyl77cV63MJt1D9SCFhoxpwcIX9vp8e7+kznXPm1YpgSVyzTwp/apkpNohvvWTQakuzJxIG7NZrkv+0naJPaTSf/RqXcY1G8qDYQ/q8+lhz0bydtm5ft/K7IP4dn2ciutALC6yh7CPSrgOZbl77pmU7yS7LjGejbRClpHrIjrMHDIGgMVRcn4hrn0RmWfUNkhdr0q5DqdDxsGfUShrJXDd8KMoev2T3ywr1/jBwGrtcS3J9YW41vyFiFnxA6erJuW6HCkGDk8qJAqSuGYuHnWtE8l2UrshtO8POUcFwbhuClANUY0bx9jfGBHxdWFCl3IdCtIpFqAQ2Ef6PF8Qn2+xwVG5VquVwqiVtDu4mCGWQcXTQTxrn+sPKbkOzCigx8/Sg2eRzDXxvDg5/eFL5USDTOI6OL1QRmxlbnhiOIyJdWgFTtmwAJt6InQk3MwiDdcH0uwTy7WuTftU+cGwX0C/ekXKNUElmv+kGK14lyI110FC7CK7NHJyvENz2l0kH/SPcA171T5rFTJHMT6st5VUsQzrYvlJ7MngsyhwrWt1blvB4qrYtNW4DpXmeFxPaOVvUuevYdTjdcsefG1sb+qmrPc9rCGanxOZ639lp3zblHLtpVAFpcFxYSB5blxrN9dSyjWi4fnANu2VZqSIcF32JaCXf6r5Gc2GlOsepse4pfQFQSvO+XFtTqdNqTrYwe+zlr4Ysu3mjJzqKNcxEfGJ8JrPFLgmfDX8LwOLLUGaVY3rUI8Qn2tD20tb20WOM/iySLyY9kYGrv0PvhD5sJ7gqtg1EFZb5qyRi3xnO4lr/9IPjbPdJQK7NtP24jgd9PQc4hireSZqg0ziuuwHalRESn42yVMAFa491CYnYnRwqsaJXOtM0B9KiAv0Wk87Gk38Fs5ecantulDdT9cf0itaTYV+93m4rKXkmqA+Gu014Bp2kl0zz7FyP3thqg+Ga0MzzHtrqfw+/C575cszadr6dKx0P80Y1344MzzNPj2agWty+Fi4iYZbhEziuh5UZUItD8GBDNd05PCR66gHjwg/kA6OSqi2Lbt9Nq20cV+M66AZA760vqJcycQ1CDfL9UVeri5JQ5jQaN6flwmB4VqHHfTKX7vqhTDsHGWvMvbNuvnywDQyaUiwHI0x7nZ/ZUrNNYmnmYLhPC/dn1grYJp7ZrnhEMM1IVs3YGBGnesfB44Yibu3rxkpe8z6XPvpo/G4hKTiuj+zxSa1eW6fkGv4bTV4coobeLJcazro5nZXOSuCXg2YdbJsq/2BDsFn4to/+4VGkCLtB30Z7JrJ1PJHCxLtuhI8yWk01CJcw341xMsGt1mWhqI7BzswDp29A4c2K2wob0cZ41oPXOrJRp+lxT4JmbheHoBrtuWknzcIHRXiWqN3w9TureGibLc46HbCP7YKmbnuje9uqu+PyLFrX0TW/W+/7xhLuOanlxgdSM8160rzWsOjXMMdGjW4v6tcQIr49VLKOQIG9JWQclIeXOTYdeCJ+D/43155no/zCNP7mEqv6avLbEjEkewo17TCal5fU9Hs7pFw30M1tttnFTUXhIJj19G+UCIh/kSApFbAv8TBG13mJfuSfD4tEiPGLTvKtUnvHqj9JAvWoUzwdMkqZE6HEO1pvzzQpFnrADyuY1NAU/5T8lpB/CFGQoZ5gaOkd1IPzTQMR1WIwzWYdpmSnRTU4KL7KmN8bttwIwO6PY68iy8Aj+vSUARXOE/xuW4MrUbpZKhmLhoDWU9wfYjF5eVK4tpIQSwbtmN2EqIax+ngAXxr27abVfVxOwoe11ERYfJzsnrjFfLMMttM2gi9F7fNVMK1HrpagAvMCHDQ8BnimvwzvePipG0AHPQua4qP7kveLJxIuxTC4HIdSaONBmuezK57rxwfG6nX643Z1XCub4H7Gpld65xBk6sT61NfXBhmE7cs1ybcl3j3TlK0jtAAAzK23WpCJSbdZi1crmtboQ/GWKOMa6ar9OrV2EATv89UPpsUn2TlgOWaBOswMH0jaYF00M9Z10XCdXNmQ5MWGFW4jozYMU/INGQ5iQ3O+LUa11pZNHYt4JoanKlduw/7tgjSI+jwKEMyxKKOtWVVaSEm3XZPfK5DLTWsnyWz6yROuE6IpjZLWubMqyVxDSA6cq3rOsJboT/L6lpbdKQxPfhcV9jqLJuGkMWNCV92WGEHmP2fjI9YSriGnPK1+1gUQaJT7q0JFKimVp1hBzM+1zpjn3OsOUq4LolHmUeFU9uKs//Tkon0ONcQZfxyKFog37zP4oZAnGlX00TmAbhcs3W+sE8s4boi2t9jQjTcqKXYP6SeuETORQ/XaaazcSi49zz6NaNVF2aOs+2DuBwYHvswE86M8B9f5L7dldULcboXl2kwlKXvKYLGKreFjRC9vBJ7LV0fiWXfd50ipwgJ4+epRIRGi5Cw/t6LTSXnGkep0ke46u4/HI7SgsdFzb56rTE5dXFicXF+a2t+cW54fbUhqeeXg7+lcL6N1YtzC4F2b83PjU9NVoR/AmSky90cEWUwaptIyMzxX22zyVqpUq9XErfUyoxyY3ZkZZJgZWWkXkkeN4BdxojrFx/GQ920RHvRYjPTsvgnQuf8dP7vrfInvAXyvhsrHaDDtCk+Gi3ObPzlbsQRVLzPn2zBH+QDAkhdK92JNZ+hVNvDeVwXaLT4mW/pLr6gvVJg5St6EzaGcPwuDc1eTaHZ3oAU6ufNtQSmbtZ+i2g2PkzBtU0HD5ozJznLMkAJsvwfF7OOH+qmKX+RddFu2yf5fe6kMEwS10z/FNr+s+PYaTZnsQvt9n7axN7nCLI+Qpz3HRtBOm+O1MdkwKqfQ23xc95eXA1enGdo/wYZ6euI+7Naa4hF67/tM+UtD3PQncZ+Z6piWHWDJ5tEi+2HtfwW0ikAMcgvXd/RRmq75UMnqlX9vpRLdQp490u75vh1sa7S3odEQVozm8Znf8+NVIAOR2gZ/s1bIVERvVLTEEiB6Gpdvzk8UKoIYaWf4CbGqIg7P8IeT0lONt2VqP32RMuYRP28AeX18vU1h2a0O4TJ5pOEezXS9uqXKTtucvRBs3R/wIZnHYQfQ/e1uBJGe37pjbpzsjPAIJZt6tofXRf2Gjk8StQQq9Cc2SzlAUxGAG+wytV+c2GPhVO477xYQ6C3ycxv+5URZr8KWfuPSxZI51dR3wI83H6+78lHzvWA+N11iYoU+DfotkisWCVhOW0MzDEYdI0W2PEpf2c+22q2j6fVb0CVIxEg2msIPeCqiNWe+ZAzfV6ATh3j3xi/4e0fYlWpq2fkSn0u8ELuX4g/ctrqbX1N00xUqe3jaa+Gm3N9bjC18u/dtf/6Ycnyb05lN9vVzYNcPM4d4DmX/viqe/rfzSbttGlX2y+PaQEmt+hzBiT+iFD8svfd//yvTeTj/zY/7Je8poSc6iT8P1RBDkJgxdbNAAAAAElFTkSuQmCC",
    price: "700",
    isTrending: false,
    isSelected: false,
    coverages: {
      "003": {
        id: "003",
        body: "Driver's Personal Accident",
      },
      "005": {
        id: "005",
        body: "Legal liability to passengers",
      },
      "006": {
        id: "006",
        body: "6 months warranty on repairs",
      },
      "007": {
        id: "007",
        body: "Loss or Damage due to accident",
      },
    },
  },
  {
    id: "103",
    companyName: "AIA",
    companyId: "1003",
    planType: "comprehensive",
    companyImgHref:
      "data:image/png;base64,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",
    price: "709",
    isTrending: false,
    isSelected: false,
    coverages: {
      "001": {
        id: "001",
        body: "Third party body injury and death",
      },
      "003": {
        id: "003",
        body: "Driver's Personal Accident",
      },
      "004": {
        id: "004",
        body: "Full special perils",
      },
      "006": {
        id: "006",
        body: "6 months warranty on repairs",
      },
    },
  },
];

const defaultSortOptions = [
  {
    value: "high-to-low",
    label: "High to Low",
  },
  {
    value: "low-to-high",
    label: "Low to High",
  },
];

// list of options for plan type
const defaultPlanTypeOptions: PlanType[] = [
  { value: "comprehensive", label: "Comprehensive", isSelected: false },
  {
    value: "third-party",
    label: "Third Party/Fire and Theft",
    isSelected: false,
  },
];

const QuoteListingsContainer = () => {
  // state for managing the filter and sort
  const [quoteFilter, updateQuoteFilter] = useState<FilterType>({
    sort: null,
    type: defaultPlanTypeOptions,
  });
  // state for managing the list of quote plans
  // fetched from the agiliux backend system
  const [quotePlans, updateQuotePlans] =
    useState<QuotePlansType[]>(defaultQuotePlans);
  const [isComparePopupVisible, shouldComparePopupVisible] =
    useState<boolean>(false);
  const [warngingPopup, setWarningPopup] = useState<WarningPopupType>({
    isVisible: false,
    title: null,
    description: null,
  });
  // update the type property of the filter
  const setTypeOfFilter = (updatedFilterTypes: PlanType[]) => {
    updateQuoteFilter((prev) => ({ ...prev, type: updatedFilterTypes }));
  };

  // update the sort property of the filter
  const setSortValueToFilter = (val: string) => {
    updateQuoteFilter((prev) => ({ ...prev, sort: val }));
  };

  // function to update selected quotes when user
  // try to compare different plans
  function updateSelectedQuotePlans(selectedQuoteId: string) {
    const updatedQuotePlans = quotePlans.map((quotePlan) =>
      quotePlan.id === selectedQuoteId
        ? { ...quotePlan, isSelected: !quotePlan.isSelected }
        : quotePlan
    );
    updateQuotePlans(updatedQuotePlans);
  }

  useEffect(() => {
    if (isComparePopupVisible) {
      const quotes = quotePlans.filter((quote) => quote.isSelected);
      if (quotes.length < 2) {
        shouldComparePopupVisible(false);
      }
    }
  }, [quotePlans]);

  // filter quotes based on user search selection i.e.
  // if user has searching for third-party or comprehensive plans
  const filterQuotePlansType = quotePlans.filter((quotePlan) =>
    quoteFilter.type
      .filter((a) => a.isSelected)
      .map((b) => b.value)
      .includes(quotePlan.planType)
  );

  const quotesToDisply =
    filterQuotePlansType.length === 0 ? quotePlans : filterQuotePlansType;

  const filterSelectedQuotes: QuotePlansType[] = quotesToDisply.filter(
    (quote) => quote.isSelected
  );

  // function to toggle isCompareBoxVisble's state
  function handleShouldComparePopup() {
    // check if the box is not opened and also checks
    // if length of selected plans are more than 1
    // then show the comparison box
    if (!isComparePopupVisible && filterSelectedQuotes.length <= 1) {
      setWarningPopup({
        isVisible: true,
        title: "Warning",
        description:
          "User need to select atleast 2 plans or products to compare.",
      });
    }
    if (!isComparePopupVisible && filterSelectedQuotes.length > 1) {
      return shouldComparePopupVisible(true);
    }
    // otherwise hide the comparison box
    return shouldComparePopupVisible(false);
  }

  return (
    <div className="flex flex-col items-center justify-between w-full h-auto">
      {warngingPopup.isVisible && (
        <DefaultPopup
          title={warngingPopup.title}
          description={warngingPopup.description}
          setShowWarningPopup={setWarningPopup}
        />
      )}
      {isComparePopupVisible && (
        <QuoteComparePopup
          selectedQuotes={filterSelectedQuotes}
          isComparePopupVisible={isComparePopupVisible}
          shouldComparePopupVisible={shouldComparePopupVisible}
          updateSelectedQuotePlans={updateSelectedQuotePlans}
        />
      )}
      <div className="relative px-4 py-3 flex items-center justify-center gap-4 w-full bg-[#F8F8F8] rounded-[10px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-auto">
          {/* Plan Type multi search field */}
          <div className="flex items-center justify-center w-auto">
            <span className="text-lg text-center text-primary-black font-bold whitespace-nowrap">
              Plan Type
            </span>
            <div className="inline-block ml-4 max-w-[365px] w-full">
              <SelectMultiSearch
                defaultOptionList={defaultPlanTypeOptions}
                selectedOptions={quoteFilter.type}
                setSelectedOptions={setTypeOfFilter}
              />
            </div>
          </div>
          {/* Sort plan field */}
          <div className="flex items-center gap-x-4 w-auto">
            <div className="flex items-center gap-x-1">
              <svg
                width="25"
                height="16"
                viewBox="0 0 25 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.5 16V14H8.5V16H0.5ZM0.5 9V7H16.5V9H0.5ZM0.5 2V0H24.5V2H0.5Z"
                  fill="#272727"
                />
              </svg>
              <span className="ml-2 text-lg text-center text-primary-black font-bold whitespace-nowrap">
                Sort By
              </span>
            </div>
            <div className="relative min-w-[150px]">
              <SelectDropdown
                id="sortPrice"
                selected={quoteFilter.sort}
                optionList={defaultSortOptions}
                onChange={setSortValueToFilter}
                placeholder="Low to High"
              />
            </div>
          </div>
        </div>
        <button
          className="relative px-2 flex items-center justify-center w-auto"
          onClick={handleShouldComparePopup}
        >
          {/* <LeftRightArrowIcon /> */}
          <span className="ml-2 text-lg text-center text-primary-blue font-bold">
            Compare
          </span>
        </button>
      </div>
      <div className="mt-8 flex flex-col items-center justify-start gap-y-4 w-full h-auto">
        {quotesToDisply.length === 0 ? (
          // quote skeleton
          <div className="relative w-full">
            <div className="animate-pulse py-6 px-4 flex items-center justify-center gap-x-4 bg-[#F8F8F8] w-full rounded-2xl" />
            <div className="mt-8 flex flex-col items-center justify-between w-full gap-y-4">
              <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
              <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
              <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        ) : (
          quotesToDisply
            // sort the quote based on pricing
            .sort((a, b) => {
              if (quoteFilter.sort) {
                const sortValue: string = quoteFilter.sort;
                if (sortValue === "high-to-low") {
                  return parseInt(b.price) - parseInt(a.price);
                }
              }
              return parseInt(a.price) - parseInt(b.price);
            })
            .map((broker) => {
              const {
                companyId,
                companyImgHref,
                companyName,
                coverages,
                id,
                price,
                isTrending,
                isSelected,
                planType,
              } = broker;
              const cov: Coverage[] = Object.values(coverages);
              return (
                <QuoteListingPlanCard
                  key={id}
                  {...{
                    companyId,
                    companyImgHref,
                    companyName,
                    id,
                    price,
                    coverages: cov,
                    planType,
                    isTrending,
                    isSelected,
                    updateSelectedQuotePlans,
                  }}
                />
              );
            })
        )}
      </div>
    </div>
  );
};

export default QuoteListingsContainer;
