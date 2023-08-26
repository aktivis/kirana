import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AttributeEditor, Select } from "@cloudscape-design/components";
import {
  RelationType,
  RelationModel,
  QuantitativeModel,
  createRelationModel,
  copyQuantitativeModel,
} from "../../../models/quantitative-model";
import { handleRelation } from "../../../controllers/quantitative-controller";

export default function RelationEditor({
  quantitative,
  setQuantitative,
}: {
  quantitative: QuantitativeModel;
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>;
}) {
  const relationshipOptions = Object.values(RelationType).map((e) => ({
    value: e,
  }));

  const constructSimilarity = (item: RelationModel) => {
    const array = [
      item.influencer_construct,
      item.independent_construct,
      item.dependent_construct,
    ];
    if (array.some((e) => e === undefined)) {
      return;
    }
    const uniqueNames = [...new Set(array.map((e) => e?.name))];
    if (uniqueNames.length < 3) {
      return "Please use different variable";
    }
  };

  const [relations, setRelations] = useState(
    quantitative.relations.length
      ? quantitative.relations
      : [createRelationModel()]
  );

  useEffect(() => {
    setQuantitative((quantitative) =>
      copyQuantitativeModel(quantitative, { relations: relations })
    );
  }, [relations, setQuantitative]);

  return (
    <>
      <AttributeEditor
        onAddButtonClick={() => {
          setRelations([...relations, createRelationModel()]);
        }}
        onRemoveButtonClick={({ detail: { itemIndex } }) => {
          const newRelations = relations.filter((_, i) => {
            return i !== itemIndex;
          });
          setRelations(newRelations);
        }}
        isItemRemovable={(item) => {
          return relations.indexOf(item) > 0;
        }}
        addButtonText="Add construct"
        removeButtonText={"Remove"}
        items={relations}
        definition={[
          {
            label: "Influencer",
            errorText: (item) => constructSimilarity(item),
            control: (item, index) => (
              <Select
                placeholder="Choose influencing variable"
                selectedOption={{
                  label: item.influencer_construct?.name,
                  value: item.influencer_construct?.name,
                }}
                options={quantitative.constructs.map((e) => ({
                  label: e.name,
                  value: e.name,
                }))}
                onChange={({ detail }) => {
                  handleRelation(
                    "influencer_construct",
                    quantitative,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
          {
            label: "Relationship",
            control: (item, index) => (
              <Select
                placeholder="Choose relationship"
                selectedOption={{
                  label: item.type,
                  value: item.type,
                }}
                options={relationshipOptions.map((e) => ({
                  label: e.value,
                  value: e.value,
                }))}
                onChange={({ detail }) => {
                  handleRelation(
                    "type",
                    quantitative,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
          {
            label: "Independent",
            errorText: (item) => constructSimilarity(item),
            control: (item, index) => (
              <Select
                disabled={item.type === RelationType.DIRECT}
                placeholder="Choose independent variable"
                selectedOption={{
                  label: item.independent_construct?.name,
                  value: item.independent_construct?.name,
                }}
                options={quantitative.constructs
                  .map((e) => ({
                    label: e.name,
                    value: e.name,
                  }))
                  .filter((e) => e.value !== item.influencer_construct?.name)}
                onChange={({ detail }) => {
                  handleRelation(
                    "independent_construct",
                    quantitative,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
          {
            label: "Dependent",
            errorText: (item) => constructSimilarity(item),
            control: (item, index) => (
              <Select
                placeholder="Choose dependent variable"
                selectedOption={{
                  label: item.dependent_construct?.name,
                  value: item.dependent_construct?.name,
                }}
                options={quantitative.constructs
                  .map((e) => ({
                    label: e.name,
                    value: e.name,
                  }))
                  .filter((e) => e.value !== item.influencer_construct?.name)}
                onChange={({ detail }) => {
                  handleRelation(
                    "dependent_construct",
                    quantitative,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}
