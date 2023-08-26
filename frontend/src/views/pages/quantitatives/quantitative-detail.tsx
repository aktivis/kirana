import {
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
  Tabs,
  Box,
} from "@cloudscape-design/components";
import { useEffect, useRef, useState } from "react";
import {
  Observations,
  QuantitativeModel,
} from "../../../models/quantitative-model";
import ConstructEditor from "../../components/quantitatives/ConstructEditor";
import IndicatorTable from "../../components/quantitatives/IndicatorTable";
import ObservationTable from "../../components/quantitatives/ObservationTable";
import RelationEditor from "../../components/quantitatives/RelationEditor";
import { useParams } from "react-router-dom";
import { useGetQuantitative } from "../../../services/quantitatives/quantitative-service";
import { QuantitativeDialogContext } from "../../../utils/providers";
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

export default function QuantitativeDetailPage() {
  const { quanID } = useParams();
  const { data, loading } = useGetQuantitative(quanID!);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<string>();
  const [dialogData, setDialogData] = useState<QuantitativeModel>();

  const QuantitativeDetailState = () => {
    return loading ? (
      <p>Loading...</p>
    ) : (
      <QuantitativeDetailContent data={data!} quantitativeID={quanID!} />
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
                    setDialogType("rename");
                    setDialogData(data!);
                    setShowDialog(true);
                  }}
                >
                  Rename
                </Button>
                <Button
                  onClick={() => {
                    setDialogType("delete");
                    setDialogData(data!);
                    setShowDialog(true);
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
        value={{ type: dialogType, data: dialogData }}
      >
        <QuantitativeDialog visible={showDialog} setVisible={setShowDialog} />
      </QuantitativeDialogContext.Provider>
    </ContentLayout>
  );
}

function QuantitativeDetailContent({
  data,
  quantitativeID,
}: {
  data: QuantitativeModel;
  quantitativeID: string;
}) {
  const [tab, setTab] = useState("analyses");
  const [quantitative, setQuantitative] = useState(data);
  const [observations, setObservations] = useState<Observations>();
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
            content: <p>Hello statistics</p>,
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
