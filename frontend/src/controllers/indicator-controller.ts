import { Dispatch, SetStateAction } from "react";
import { IndicatorModel } from "../models/quantitative-model";

export const checkIndicatorsSimilarity = (
  oldIndicators: IndicatorModel[],
  newIndicators: IndicatorModel[],
  setSimilarIndicators: Dispatch<SetStateAction<boolean>>
) => {
  if (JSON.stringify(oldIndicators) !== JSON.stringify(newIndicators)) {
    setSimilarIndicators(false);
  } else {
    setSimilarIndicators(true);
  }
};

export const saveIndicators = (newIndicators: IndicatorModel[]) => {
  return newIndicators.filter((item) => item.id !== undefined);
};
