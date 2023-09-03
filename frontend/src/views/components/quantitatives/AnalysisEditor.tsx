import { AttributeEditor, Input, Select } from "@cloudscape-design/components";
import { Dispatch, SetStateAction } from "react";
import {
  AnalysisModel,
  AnalysisType,
  createAnalysisModel,
} from "../../../models/quantitative-model";

export default function AnalysisEditor({
  quantitativeID,
  analyses,
  setAnalyses,
}: {
  quantitativeID: number;
  analyses: AnalysisModel[];
  setAnalyses: Dispatch<SetStateAction<AnalysisModel[]>>;
}) {
  const typeOptions = Object.values(AnalysisType).map((e) => ({
    value: e,
  }));

  return (
    <AttributeEditor
      onAddButtonClick={() =>
        setAnalyses([...analyses, createAnalysisModel(quantitativeID)])
      }
      onRemoveButtonClick={({ detail: { itemIndex } }) => {
        const newRelations = analyses.filter((_, i) => {
          return i !== itemIndex;
        });
        setAnalyses(newRelations);
      }}
      addButtonText="Add analysis"
      removeButtonText="Remove"
      items={analyses}
      definition={[
        {
          label: "Name",
          control: (item, index) => (
            <Input
              placeholder="Name the analysis"
              value={item.name}
              onChange={({ detail }) => {
                const newAnalyses = analyses.map((e, i) => {
                  return i === index ? { ...item, name: detail.value } : e;
                });
                setAnalyses(newAnalyses);
              }}
            />
          ),
        },
        {
          label: "Type",
          control: (item, index) => (
            <Select
              placeholder="Choose the analysis type"
              options={typeOptions}
              selectedOption={{ value: item.type }}
              onChange={({ detail }) => {
                const newAnalyses = analyses.map((e, i) => {
                  const selectedValue = detail.selectedOption.value;
                  return i === index
                    ? {
                        ...item,
                        type: selectedValue as AnalysisType,
                      }
                    : e;
                });
                setAnalyses(newAnalyses);
              }}
            />
          ),
        },
      ]}
    />
  );
}
