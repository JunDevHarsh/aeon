import React from "react";

type ErrorStateType = {
  message: string | null;
  code: number | null;
  description: string | null;
  shouldErrorBeShown: boolean;
};

function useErrorState() {
  const [error, updateError] = React.useState<ErrorStateType>({
    message: null,
    code: null,
    description: null,
    shouldErrorBeShown: false,
  });
  console.log("Called");

  // set error
  function setError(
    message: string | null,
    code: number | null,
    description: string | null
  ) {
    updateError((prevError) => ({
      ...prevError,
      message,
      code,
      description,
      shouldErrorBeShown: true,
    }));
  }

  // clear error
  function clearError() {
    updateError((prevError) => ({
      ...prevError,
      message: null,
      code: null,
      description: null,
      shouldErrorBeShown: false,
    }));
  }

  return {
    error,
    setError,
    clearError,
  };
}

export default useErrorState;
