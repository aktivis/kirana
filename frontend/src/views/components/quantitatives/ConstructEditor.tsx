import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AttributeEditor,
  Input,
  Multiselect,
} from "@cloudscape-design/components";
import {
  QuantitativeModel,
  copyQuantitativeModel,
  createConstructModel,
} from "../../../models/quantitative-model";

export default function ConstructEditor({
  quantitative,
  setQuantitative,
}: {
  quantitative: QuantitativeModel;
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>;
}) {
  const [constructs, setConstructs] = useState(
    quantitative.constructs.length
      ? quantitative.constructs
      : [createConstructModel()]
  );

  useEffect(() => {
    setQuantitative((quantitative) =>
      copyQuantitativeModel(quantitative, { constructs: constructs })
    );
  }, [constructs, setQuantitative]);

  return (
    <>
      <AttributeEditor
        onAddButtonClick={() => {
          setConstructs([...constructs, createConstructModel()]);
        }}
        onRemoveButtonClick={({ detail: { itemIndex } }) => {
          const newConstructs = constructs.filter((_, i) => {
            return i !== itemIndex;
          });
          setConstructs(newConstructs);
        }}
        isItemRemovable={(item) => {
          return constructs.indexOf(item) > 0;
        }}
        addButtonText="Add construct"
        removeButtonText={"Remove"}
        items={constructs}
        definition={[
          {
            label: "Name",
            control: (item, index) => (
              <Input
                value={item.name}
                placeholder="Construct's short name"
                onChange={({ detail }) => {
                  const newConstructs = constructs.map((e, i) => {
                    return i === index ? { ...item, name: detail.value } : e;
                  });
                  setConstructs(newConstructs);
                }}
              />
            ),
          },
          {
            label: "Description",
            control: (item, index) => (
              <Input
                value={item.description}
                placeholder="Construct's full name"
                onChange={({ detail }) => {
                  const newConstructs = constructs.map((e, i) => {
                    return i === index
                      ? { ...item, description: detail.value }
                      : e;
                  });
                  setConstructs(newConstructs);
                }}
              />
            ),
          },
          {
            label: "Indicators",
            control: (item, index) => (
              <Multiselect
                placeholder="Choose indicators"
                tokenLimit={0}
                selectedOptions={item.indicators.map((e) => ({
                  label: e.alias,
                  value: e.alias,
                }))}
                options={quantitative.indicators
                  .filter((e) => e.visibility)
                  .map((e) => ({
                    label: e.alias,
                    value: e.alias,
                  }))}
                onChange={({ detail }) => {
                  const newIndicators = detail.selectedOptions.flatMap(
                    (option) =>
                      quantitative.indicators.filter(
                        (element) => element.alias === option.value
                      )
                  );
                  const newConstructs = constructs.map((e, i) => ({
                    ...e,
                    indicators: i === index ? newIndicators : e.indicators,
                  }));
                  setConstructs(newConstructs);
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}
