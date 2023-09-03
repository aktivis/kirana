import { Dispatch, SetStateAction } from "react";
import { RelationModel } from "../models/quantitative-model";

export const checkRelationsSimilarity = (
  oldRelations: RelationModel[],
  newRelations: RelationModel[],
  setSimilarRelations: Dispatch<SetStateAction<boolean>>
) => {
  if (JSON.stringify(oldRelations) !== JSON.stringify(newRelations)) {
    setSimilarRelations(false);
  } else {
    setSimilarRelations(true);
  }
};

export const saveRelations = (
  oldRelations: RelationModel[],
  newRelations: RelationModel[],
  quantitativeID: string
) => {
  const oldIds = oldRelations.map((item) => item.id!);
  const newIds = newRelations.map((item) => item.id);

  const relationsToDelete = oldIds.filter((item) => !newIds.includes(item));
  const relationsToAdd = newRelations
    .filter((item) => item.id === undefined)
    .map((item) => ({
      ...item,
      quantitative_id: Number.parseInt(quantitativeID),
    }));
  const relationsToUpdate = newRelations.filter(
    (item) => item.id !== undefined
  );

  return {
    relationsToDelete,
    relationsToAdd,
    relationsToUpdate,
  };
};
