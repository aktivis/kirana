import {
  Form,
  FormField,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
  QuantitativeModel,
  copyQuantitativeModel,
} from "../../../models/quantitative-model";

export default function NameForm({
  researchID,
  quantitative,
  setQuantitative,
}: {
  researchID: string;
  quantitative: QuantitativeModel;
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>;
}) {
  const [name, setName] = useState(quantitative.name);

  useEffect(() => {
    setQuantitative((quantitative) =>
      copyQuantitativeModel(quantitative, { name: name })
    );
  }, [name, setQuantitative]);

  return (
    <Form>
      <SpaceBetween direction="vertical" size="l">
        <FormField
          label="Research ID"
          description="The project where the model will belong in"
        >
          <Input value={researchID} disabled={true} />
        </FormField>
        <FormField label="Name" description="The name of the model">
          <Input
            value={quantitative.name}
            placeholder="Name the quantitative model"
            onChange={({ detail }) => {
              setName(detail.value);
            }}
          />
        </FormField>
      </SpaceBetween>
    </Form>
  );
}
