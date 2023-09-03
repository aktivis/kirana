import {
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
  Tabs,
  Box,
} from "@cloudscape-design/components";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  AnalysisModel,
  ObservationModel,
  QuantitativeModel,
} from "../../../models/quantitative-model";
import ConstructEditor from "../../components/quantitatives/ConstructEditor";
import IndicatorTable from "../../components/quantitatives/IndicatorTable";
import ObservationTable from "../../components/quantitatives/ObservationTable";
import RelationEditor from "../../components/quantitatives/RelationEditor";
import { useParams } from "react-router-dom";
import { useGetQuantitative } from "../../../services/quantitatives/quantitative-service";
import {
  AnalysisDialogContext,
  QuantitativeDialogContext,
} from "../../../utils/providers";
import { QuantitativeDialog } from "../../components/quantitatives/QuantitativeDialog";
import {
  useDeleteConstructs,
  usePostConstructs,
  useUpdateConstructs,
} from "../../../services/quantitatives/construct-service";
import {
  checkConstructsSimilarity,
  saveConstructs,
} from "../../../controllers/construct-controller";
import {
  checkRelationsSimilarity,
  saveRelations,
} from "../../../controllers/relation-controller";
import {
  useDeleteRelations,
  usePostRelations,
  useUpdateRelations,
} from "../../../services/quantitatives/relation-service";
import { useUpdateIndicators } from "../../../services/quantitatives/indicator-service";
import { checkIndicatorsSimilarity } from "../../../controllers/indicator-controller";
import { useGetObservation } from "../../../services/quantitatives/observation-service";
import AnalysisTable from "../../components/quantitatives/AnalysisTable";
import AnalysisEditor from "../../components/quantitatives/AnalysisEditor";
import { AnalysisDialog } from "../../components/quantitatives/AnalysisDialog";
import { usePostAnalyses } from "../../../services/quantitatives/analysis-service";

export default function QuantitativeDetailPage() {
  const { quanID } = useParams();
  const { data, loading } = useGetQuantitative(quanID!);
  const [showQuantyDialog, setShowQuantyDialog] = useState(false);
  const [quantyDialogType, setQuantyDialogType] = useState<string>();
  const [quantyDialogData, setQuantyDialogData] = useState<QuantitativeModel>();
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [analysisDialogType, setAnalysisDialogType] = useState<string>();
  const [analysisDialogData, setAnalysisDialogData] = useState<AnalysisModel>();

  const QuantitativeDetailState = () => {
    return loading ? (
      <p>Loading...</p>
    ) : (
      <QuantitativeDetailContent
        data={data!}
        quantitativeID={quanID!}
        setShowAnalysisDialog={setShowAnalysisDialog}
        setAnalysisDialogType={setAnalysisDialogType}
        setAnalysisDialogData={setAnalysisDialogData}
      />
    );
  };

  return (
    <ContentLayout
      header={
        <Header
          actions={
            <>
              <SpaceBetween size="xs" direction="horizontal">
                <Button
                  onClick={() => {
                    setQuantyDialogType("rename");
                    setQuantyDialogData(data!);
                    setShowQuantyDialog(true);
                  }}
                >
                  Rename
                </Button>
                <Button
                  onClick={() => {
                    setQuantyDialogType("delete");
                    setQuantyDialogData(data!);
                    setShowQuantyDialog(true);
                  }}
                >
                  Delete
                </Button>
              </SpaceBetween>
            </>
          }
        >
          {data?.name}
        </Header>
      }
    >
      <QuantitativeDetailState />
      <QuantitativeDialogContext.Provider
        value={{ type: quantyDialogType, data: quantyDialogData }}
      >
        <QuantitativeDialog
          visible={showQuantyDialog}
          setVisible={setShowQuantyDialog}
        />
      </QuantitativeDialogContext.Provider>
      <AnalysisDialogContext.Provider
        value={{ type: analysisDialogType, data: analysisDialogData }}
      >
        <AnalysisDialog
          visible={showAnalysisDialog}
          setVisible={setShowAnalysisDialog}
        />
      </AnalysisDialogContext.Provider>
    </ContentLayout>
  );
}

function QuantitativeDetailContent({
  data,
  quantitativeID,
  setShowAnalysisDialog,
  setAnalysisDialogType,
  setAnalysisDialogData,
}: {
  data: QuantitativeModel;
  quantitativeID: string;
  setShowAnalysisDialog: Dispatch<SetStateAction<boolean>>;
  setAnalysisDialogType: Dispatch<SetStateAction<string | undefined>>;
  setAnalysisDialogData: Dispatch<SetStateAction<AnalysisModel | undefined>>;
}) {
  const [tab, setTab] = useState("analyses");
  const [observationPage, setObservationPage] = useState(1);
  const [quantitative, setQuantitative] = useState(data);
  const { data: obs, loading } = useGetObservation(
    quantitativeID,
    observationPage.toString()
  );
  const [observations, setObservations] = useState<ObservationModel>();
  const [analyses, setAnalyses] = useState<AnalysisModel[]>([]);
  const oldIndicators = useRef(quantitative.indicators).current;
  const oldConstructs = useRef(quantitative.constructs).current;
  const oldRelations = useRef(quantitative.relations).current;
  const [similarIndicators, setSimilarIndicators] = useState(true);
  const [similarConstructs, setSimilarConstructs] = useState(true);
  const [similarRelations, setSimilarRelations] = useState(true);
  const { updateTrigger: updateIndicators } =
    useUpdateIndicators(quantitativeID);
  const { deleteTrigger: deleteConstructs } =
    useDeleteConstructs(quantitativeID);
  const { postTrigger: postConstructs } = usePostConstructs(quantitativeID);
  const { updateTrigger: updateConstructs } =
    useUpdateConstructs(quantitativeID);
  const { deleteTrigger: deleteRelations } = useDeleteRelations(quantitativeID);
  const { postTrigger: postRelations } = usePostRelations(quantitativeID);
  const { updateTrigger: updateRelations } = useUpdateRelations(quantitativeID);
  const { postTrigger: postAnalyses } = usePostAnalyses(quantitativeID);

  useEffect(() => {
    if (!loading) {
      setObservations(obs);
    }
  }, [loading, obs]);

  useEffect(() => {
    checkIndicatorsSimilarity(
      oldIndicators,
      quantitative.indicators,
      setSimilarIndicators
    );
  }, [oldIndicators, quantitative.indicators]);

  useEffect(() => {
    checkConstructsSimilarity(
      oldConstructs,
      quantitative.constructs,
      setSimilarConstructs
    );
  }, [oldConstructs, quantitative.constructs]);

  useEffect(() => {
    checkRelationsSimilarity(
      oldRelations,
      quantitative.relations,
      setSimilarRelations
    );
  }, [oldRelations, quantitative.relations]);

  return (
    <>
      <ObservationTable
        observationPage={observationPage}
        setObservationPage={setObservationPage}
        observations={observations}
        setObservations={setObservations}
        quantitative={quantitative}
        setQuantitative={setQuantitative}
      />
      <Tabs
        activeTabId={tab}
        onChange={({ detail }) => {
          setTab(detail.activeTabId);
        }}
        tabs={[
          {
            id: "analyses",
            label: "Analyses",
            content: (
              <SpaceBetween direction="vertical" size="l">
                {quantitative.analyses.map((analysis, index) => (
                  <AnalysisTable
                    key={index}
                    analysis={analysis}
                    setShowAnalysisDialog={setShowAnalysisDialog}
                    setAnalysisDialogType={setAnalysisDialogType}
                    setAnalysisDialogData={setAnalysisDialogData}
                  />
                ))}
                <AnalysisEditor
                  quantitativeID={Number.parseInt(quantitativeID)}
                  analyses={analyses}
                  setAnalyses={setAnalyses}
                />
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      variant="link"
                      disabled={!analyses.length}
                      onClick={() => setAnalyses([])}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      disabled={!analyses.length}
                      onClick={() => postAnalyses(analyses)}
                    >
                      Save changes
                    </Button>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            ),
          },
          {
            id: "relations",
            label: "Relations",
            content: (
              <SpaceBetween direction="vertical" size="l">
                <RelationEditor
                  quantitative={quantitative}
                  setQuantitative={setQuantitative}
                />
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      variant="link"
                      disabled={similarRelations}
                      onClick={() => {
                        setQuantitative((quantitative) => ({
                          ...quantitative,
                          relations: oldRelations,
                        }));
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      disabled={similarRelations}
                      onClick={() => {
                        const {
                          relationsToDelete,
                          relationsToAdd,
                          relationsToUpdate,
                        } = saveRelations(
                          oldRelations,
                          quantitative.relations,
                          quantitativeID
                        );
                        deleteRelations(relationsToDelete);
                        postRelations(relationsToAdd);
                        updateRelations(relationsToUpdate);
                      }}
                    >
                      Save changes
                    </Button>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            ),
          },
          {
            id: "constructs",
            label: "Constructs",
            content: (
              <SpaceBetween direction="vertical" size="l">
                <ConstructEditor
                  quantitative={quantitative}
                  setQuantitative={setQuantitative}
                />
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      variant="link"
                      disabled={similarConstructs}
                      onClick={() => {
                        setQuantitative((quantitative) => ({
                          ...quantitative,
                          constructs: oldConstructs,
                        }));
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      disabled={similarConstructs}
                      onClick={() => {
                        const {
                          constructsToDelete,
                          constructsToAdd,
                          constructsToUpdate,
                        } = saveConstructs(
                          oldConstructs,
                          quantitative.constructs,
                          quantitativeID
                        );
                        deleteConstructs(constructsToDelete);
                        postConstructs(constructsToAdd);
                        updateConstructs(constructsToUpdate);
                      }}
                    >
                      Save changes
                    </Button>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            ),
          },
          {
            id: "indicators",
            label: "Indicators",
            content: (
              <SpaceBetween direction="vertical" size="l">
                <IndicatorTable
                  quantitative={quantitative}
                  setQuantitative={setQuantitative}
                />
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      variant="link"
                      disabled={similarIndicators}
                      onClick={() => {
                        setQuantitative((quantitative) => ({
                          ...quantitative,
                          indicators: oldIndicators,
                        }));
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      disabled={similarIndicators}
                      onClick={() => {
                        updateIndicators(quantitative.indicators);
                      }}
                    >
                      Save changes
                    </Button>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            ),
          },
        ]}
      />
    </>
  );
}
