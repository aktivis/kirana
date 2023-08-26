import { useState } from "react";
import { Wizard } from "@cloudscape-design/components";
import ObservationTable from "../../components/quantitatives/ObservationTable";
import IndicatorTable from "../../components/quantitatives/IndicatorTable";
import ConstructEditor from "../../components/quantitatives/ConstructEditor";
import RelationEditor from "../../components/quantitatives/RelationEditor";
import {
  Observations,
  createQuantitativeModel,
} from "../../../models/quantitative-model";
import { useParams } from "react-router-dom";
import NameForm from "../../components/quantitatives/NameForm";
import { usePostQuantitative } from "../../../services/quantitatives/quantitative-service";

export default function QuantitativeCreatePage() {
  const { id } = useParams();
  const { postTrigger } = usePostQuantitative();
  const [quantitative, setQuantitative] = useState(createQuantitativeModel({}));
  const [observations, setObservations] = useState<Observations>();

  return (
    <>
      <Wizard
        i18nStrings={{
          stepNumberLabel: (i) => (i < 5 ? `Step ${i}` : "Final Step"),
          collapsedStepsLabel: (i, n) =>
            i < 5 ? `Step ${i} of ${n}` : "Final Step",
          submitButton: "Start analysis",
          nextButton: "Next",
          previousButton: "Previous",
        }}
        onSubmit={() => {
          postTrigger({
            research_id: Number.parseInt(id!),
            name: quantitative.name,
            indicators: quantitative.indicators,
            constructs: quantitative.constructs,
            relations: quantitative.relations,
          });
        }}
        steps={[
          {
            title: "Name Model",
            content: (
              <NameForm
                researchID={id!}
                quantitative={quantitative}
                setQuantitative={setQuantitative}
              />
            ),
          },
          {
            title: "Select Observation",
            content: (
              <ObservationTable
                observations={observations}
                setObservations={setObservations}
                quantitative={quantitative}
                setQuantitative={setQuantitative}
              />
            ),
          },
          {
            title: "Define Indicators",
            content: (
              <IndicatorTable
                quantitative={quantitative}
                setQuantitative={setQuantitative}
              />
            ),
          },
          {
            title: "Determine Constructs",
            content: (
              <ConstructEditor
                quantitative={quantitative}
                setQuantitative={setQuantitative}
              />
            ),
          },
          {
            title: "Create Relations",

            content: (
              <RelationEditor
                quantitative={quantitative}
                setQuantitative={setQuantitative}
              />
            ),
          },
        ]}
      />
    </>
  );
}
