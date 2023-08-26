import { useState } from "react";
import { Wizard } from "@cloudscape-design/components";
import ObservationTable from "../../components/quantitatives/ObservationTable";
import IndicatorTable from "../../components/quantitatives/IndicatorTable";
import ConstructEditor from "../../components/quantitatives/ConstructEditor";
import RelationEditor from "../../components/quantitatives/RelationEditor";
import {
  ObservationModel,
  createQuantitativeModel,
} from "../../../models/quantitative-model";
import { useParams } from "react-router-dom";
import NameForm from "../../components/quantitatives/NameForm";
import { usePostQuantitative } from "../../../services/quantitatives/quantitative-service";
import { useUpsertObservation } from "../../../services/quantitatives/observation-service";

export default function QuantitativeCreatePage() {
  const { id } = useParams();
  const { postTrigger: postQuantitative } = usePostQuantitative();
  const { postTrigger: postObservations } = useUpsertObservation(id!);
  const [file, setFile] = useState<File>();
  const [quantitative, setQuantitative] = useState(createQuantitativeModel({}));
  const [observations, setObservations] = useState<ObservationModel>();
  const [observationPage, setObservationPage] = useState(1);

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
          postQuantitative({
            research_id: Number.parseInt(id!),
            name: quantitative.name,
            indicators: quantitative.indicators,
            constructs: quantitative.constructs,
            relations: quantitative.relations,
          });
          postObservations(file!);
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
                observationPage={observationPage}
                setObservationPage={setObservationPage}
                setFile={setFile}
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
