import {
  Button,
  Header,
  SpaceBetween,
  Table,
  TextContent,
} from "@cloudscape-design/components";
import {
  AnalysisModel,
  AnalysisResult,
  Datum,
} from "../../../models/quantitative-model";
import { useRunAnalysis } from "../../../services/quantitatives/analysis-service";
import { Dispatch, SetStateAction } from "react";

export default function AnalysisTable({
  analysis,
  setShowAnalysisDialog,
  setAnalysisDialogType,
  setAnalysisDialogData,
}: {
  analysis: AnalysisModel;
  setShowAnalysisDialog: Dispatch<SetStateAction<boolean>>;
  setAnalysisDialogType: Dispatch<SetStateAction<string | undefined>>;
  setAnalysisDialogData: Dispatch<SetStateAction<AnalysisModel | undefined>>;
}) {
  const { runTrigger } = useRunAnalysis(
    analysis.id!.toString(),
    analysis.quantitative_id!.toString()
  );

  const handleData = (content: AnalysisResult | null) => {
    if (content === null) return [];

    return content?.columns.map((header) => ({
      header: header === "describe" ? "" : header,
      cell: (item: Datum) => (
        <TextContent>
          {header === "describe" ? <b>{item[header]}</b> : item[header]}
        </TextContent>
      ),
    }));
  };

  return (
    <>
      <Table
        header={
          <Header
            children={analysis.name + " - " + analysis.type}
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button
                  variant="primary"
                  onClick={() => {
                    runTrigger({
                      id: analysis.id!,
                      quantitative_id: analysis.quantitative_id!,
                    });
                  }}
                >
                  Run
                </Button>
                <Button
                  onClick={() => {
                    setAnalysisDialogType("modify");
                    setAnalysisDialogData(analysis);
                    setShowAnalysisDialog(true);
                  }}
                >
                  Modify
                </Button>
                <Button
                  onClick={() => {
                    setAnalysisDialogType("delete");
                    setAnalysisDialogData(analysis);
                    setShowAnalysisDialog(true);
                  }}
                >
                  Delete
                </Button>
              </SpaceBetween>
            }
          />
        }
        columnDefinitions={handleData(analysis.result)}
        items={analysis.result?.data ?? []}
        sortingDisabled
        stripedRows
        stickyHeader
        variant="borderless"
        empty="Please run the analysis."
      />
    </>
  );
}
