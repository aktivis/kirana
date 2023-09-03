import { Dispatch, SetStateAction } from "react";
import {
  IndicatorRole,
  IndicatorType,
  RelationType,
  IndicatorModel,
  ConstructModel,
  RelationModel,
  QuantitativeModel,
  copyQuantitativeModel,
} from "../models/quantitative-model";
import { csvParse } from "d3";
import { TableProps } from "../../node_modules/@cloudscape-design/components/table/interfaces";
import { CollectionPreferencesProps } from "../../node_modules/@cloudscape-design/components/collection-preferences/interfaces";
import { SelectProps } from "../../node_modules/@cloudscape-design/components/select/interfaces";

export const handleCSV = async (
  file: File,
  quantitative: QuantitativeModel,
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>
) => {
  if (file === undefined) return;

  const blob = await file.text();
  const csv = csvParse(blob);
  const newIndicators = csv.columns.map((e, i): IndicatorModel => {
    return {
      id: undefined,
      quantitative_id: undefined,
      construct_id: null,
      order: i,
      visibility: true,
      origin: e,
      alias: e,
      type: IndicatorType.TEXT,
      role: IndicatorRole.PROFILE,
    };
  });

  const newState = copyQuantitativeModel(quantitative, {
    indicators: newIndicators,
  });
  setQuantitative(newState);
  return csv;
};

export const handleIndicatorProps = (
  indicator: IndicatorModel,
  column: TableProps.ColumnDefinition<IndicatorModel>,
  newValue: unknown,
  quantitative: QuantitativeModel,
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>
) => {
  const newIndicators = quantitative.indicators.map((e, i) => {
    return (e.id ?? i) === (indicator.id ?? indicator.order)
      ? { ...e, [column.id!]: newValue }
      : e;
  });

  const newState = copyQuantitativeModel(quantitative, {
    indicators: newIndicators,
  });
  setQuantitative(newState);
};

export const handleIndicatorPreferences = (
  detail: CollectionPreferencesProps.Preferences,
  quantitative: QuantitativeModel,
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>
) => {
  const rows = detail.contentDisplay!;
  const newIndicators = quantitative.indicators
    .map((item, index) => {
      const matchedRow = rows.find(
        (row, i) => (item.id ?? index)?.toString() === (row.id ?? i).toString()
      );
      return matchedRow
        ? {
            ...item,
            order: rows.indexOf(matchedRow),
            visibility: matchedRow.visible,
          }
        : item;
    })
    .sort((a, b) => a.order - b.order);

  const newState = copyQuantitativeModel(quantitative, {
    indicators: newIndicators,
  });
  setQuantitative(newState);
};

export const handleRelation = (
  field: string,
  quantitative: QuantitativeModel,
  detail: SelectProps.ChangeDetail,
  index: number,
  relations: RelationModel[],
  setRelations: Dispatch<SetStateAction<RelationModel[]>>
) => {
  let newField: ConstructModel | RelationType;

  switch (field) {
    case "influencer_construct":
    case "independent_construct":
    case "dependent_construct":
      newField = quantitative.constructs.find(
        (e) => e.name === detail.selectedOption.value
      ) as ConstructModel;
      break;
    case "type":
      newField = detail.selectedOption.value as RelationType;
      break;
  }

  const newRelations = relations.map((e, i) => {
    if (detail.selectedOption.value !== RelationType.DIRECT) {
      return {
        ...e,
        [field]: i === index ? newField : e[field as keyof typeof e],
      };
    }
    return {
      ...e,
      type: i === index ? RelationType.DIRECT : e.type,
      independent_construct: i === index ? null : e.independent_construct,
    };
  });
  setRelations(newRelations);
};
