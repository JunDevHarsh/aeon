import { useState, createContext, useEffect } from "react";
import InsuranceStepsLayout from "../components/layout/InsuranceSteps";
import StepperNavbar from "../components/navbar/Stepper";
import InsuranceContextProvider from "../context/InsuranceContext";
import StepContextProvider from "../context/StepContext";
import VehicleCoverageContainer from "../components/container/VehicleCoverage";

type GeneratedValue = {
  minValue: number;
  maxValue: number;
};

export type VehicleCoverageState = {
  isContainerVisible: boolean;
  coverage: {
    type: "market" | "agreed";
    market: {
      variant: string | null;
      price: number;
      generatedValues: Record<string, GeneratedValue>;
      value: {
        min: number;
        max: number;
      } | null;
    };
    agreed: {
      variant: string | null;
      type: string | null;
      price: number;
      generatedValues: Record<string, GeneratedValue>;
      value: {
        min: number;
        max: number;
      } | null;
    };
  };
  selectedCoverage: {
    type: "market" | "agreed";
    price: number;
  } | null;
};

const initialVehicleCoverage: VehicleCoverageState = {
  isContainerVisible: false,
  coverage: {
    type: "market",
    market: {
      variant: null,
      price: 0,
      value: null,
      generatedValues: {},
    },
    agreed: {
      variant: null,
      type: null,
      price: 0,
      value: null,
      generatedValues: {},
    },
  },
  selectedCoverage: null,
};

export const VehicleCoverageContext = createContext<{
  store: VehicleCoverageState;
  dispatch: React.Dispatch<React.SetStateAction<VehicleCoverageState>>;
}>({ store: initialVehicleCoverage, dispatch: () => null });

function getRandomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

function generateVehicleCoverages(): {
  minValue: number;
  maxValue: number;
} {
  const minValue: number = getRandomNumber(10, 15) * 1000;
  const maxValue: number = getRandomNumber(16, 20) * 1000;
  return { minValue, maxValue };
}

const InsurancePage = () => {
  const [vehicleCoverage, setVehicleCoverage] = useState<VehicleCoverageState>(
    initialVehicleCoverage
  );

  const {
    type,
    agreed: {
      type: agreedType,
      variant: agreedVariant,
      generatedValues: generatedAgreedValues,
    },
    market: { variant: marketVariant, generatedValues: generatedMarketValues },
  } = vehicleCoverage.coverage;

  useEffect(() => {
    if (type === "market" && marketVariant) {
      const getGeneratedValue = generatedMarketValues[marketVariant];
      if (getGeneratedValue) {
        const { minValue, maxValue } = getGeneratedValue;
        return setVehicleCoverage((prev: VehicleCoverageState) => ({
          ...prev,
          coverage: {
            ...prev.coverage,
            market: {
              ...prev.coverage.market,
              price: minValue,
              value: {
                min: minValue,
                max: maxValue,
              },
            },
          },
        }));
      }
      const newGeneratedValues: GeneratedValue = generateVehicleCoverages();
      console.log(newGeneratedValues);
      const { minValue, maxValue } = newGeneratedValues;
      setVehicleCoverage((prev: VehicleCoverageState) => ({
        ...prev,
        coverage: {
          ...prev.coverage,
          market: {
            ...prev.coverage.market,
            generatedValues: {
              ...prev.coverage.market.generatedValues,
              [marketVariant]: newGeneratedValues,
            },
            price: minValue,
            value: {
              min: minValue,
              max: maxValue,
            },
          },
        },
      }));
    } else if (type === "agreed") {
      if (agreedVariant && agreedType) {
        const getGeneratedValue = generatedAgreedValues[agreedVariant];
        if (getGeneratedValue) {
          const { minValue, maxValue } = getGeneratedValue;
          return setVehicleCoverage((prev: VehicleCoverageState) => ({
            ...prev,
            coverage: {
              ...prev.coverage,
              agreed: {
                ...prev.coverage.agreed,
                price: minValue,
                value: {
                  min: minValue,
                  max: maxValue,
                },
              },
            },
          }));
        }
        const newGeneratedValues: GeneratedValue = generateVehicleCoverages();
        const { minValue, maxValue } = newGeneratedValues;
        setVehicleCoverage((prev: VehicleCoverageState) => ({
          ...prev,
          coverage: {
            ...prev.coverage,
            agreed: {
              ...prev.coverage.agreed,
              generatedValues: {
                ...prev.coverage.agreed.generatedValues,
                [agreedVariant]: newGeneratedValues,
              },
              price: minValue,
              value: {
                min: minValue,
                max: maxValue,
              },
            },
          },
        }));
      }
    }
  }, [marketVariant, agreedVariant]);

  return (
    <VehicleCoverageContext.Provider
      value={{ store: vehicleCoverage, dispatch: setVehicleCoverage }}
    >
      <StepContextProvider>
        <InsuranceContextProvider>
          {vehicleCoverage.isContainerVisible ? (
            <VehicleCoverageContainer />
          ) : (
            <div className="py-10 mx-auto max-w-7xl w-full">
              <div className="py-8 px-12 flex flex-col items-center justify-center gap-y-4 w-full bg-white rounded-[20px] shadow-container">
                <StepperNavbar />
                <InsuranceStepsLayout />
              </div>
            </div>
          )}
        </InsuranceContextProvider>
      </StepContextProvider>
    </VehicleCoverageContext.Provider>
  );
};

export default InsurancePage;
