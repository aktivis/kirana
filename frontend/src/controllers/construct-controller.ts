import { Dispatch, SetStateAction } from "react";
import { ConstructModel } from "../models/quantitative-model";

export const checkConstructsSimilarity = (
  oldConstructs: ConstructModel[],
  newConstructs: ConstructModel[],
  setSimilarConstructs: Dispatch<SetStateAction<boolean>>
) => {
  if (JSON.stringify(oldConstructs) !== JSON.stringify(newConstructs)) {
    setSimilarConstructs(false);
  } else {
    setSimilarConstructs(true);
  }
};

export const saveConstructs = (
  oldConstructs: ConstructModel[],
  newConstructs: ConstructModel[],
  quantitativeID: string
) => {
  const oldIds = oldConstructs.map((item) => item.id!);
  const newIds = newConstructs.map((item) => item.id);

  const constructsToDelete = oldIds.filter((item) => !newIds.includes(item));
  const constructsToAdd = newConstructs
    .filter((item) => item.id === undefined)
    .map((item) => ({
      ...item,
      quantitative_id: Number.parseInt(quantitativeID),
    }));
  const constructsToUpdate = newConstructs.filter(
    (item) => item.id !== undefined
  );

  return {
    constructsToDelete,
    constructsToAdd,
    constructsToUpdate,
  };
};
