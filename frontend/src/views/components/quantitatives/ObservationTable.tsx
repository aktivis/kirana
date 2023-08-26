import { Table, Pagination, FileUpload } from "@cloudscape-design/components";
import { Dispatch, SetStateAction, useState } from "react";
import {
  ObservationDatum,
  ObservationModel,
  QuantitativeModel,
} from "../../../models/quantitative-model";
import { handleCSV } from "../../../controllers/quantitative-controller";

export default function ObservationTable({
  observationPage,
  setObservationPage,
  setFile,
  observations,
  setObservations,
  quantitative,
  setQuantitative,
}: {
  observationPage: number;
  setObservationPage: Dispatch<SetStateAction<number>>;
  setFile?: Dispatch<SetStateAction<File | undefined>>;
  observations: ObservationModel | undefined;
  setObservations: Dispatch<SetStateAction<ObservationModel | undefined>>;
  quantitative: QuantitativeModel;
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>;
}) {
  const [loading, setLoading] = useState(false);

  const handleObservations = (observations: ObservationModel | undefined) => {
    if (observations === undefined) return [];

    const { columns } = observations;

    return columns.map((e) => ({
      header: e,
      cell: (item: ObservationDatum) => item[e],
      width: 200,
    }));
  };

  return (
    <>
      <Table
        columnDefinitions={handleObservations(observations)}
        items={observations?.data ?? []}
        sortingDisabled
        stripedRows
        stickyHeader
        variant="container"
        pagination={
          observations ? (
            <Pagination
              currentPageIndex={observationPage}
              pagesCount={observations?.length / 5}
              onChange={({ detail }) => {
                setObservationPage(detail.currentPageIndex);
              }}
            />
          ) : null
        }
        loadingText="Loading observations"
        loading={loading}
        empty={
          <FileUpload
            accept=".csv"
            onChange={({ detail }) => {
              setLoading(true);

              if (setFile) setFile(detail.value[0]);

              handleCSV(detail.value[0], quantitative, setQuantitative)
                .then((value) => {
                  setObservations({
                    length: value!.length,
                    columns: value!.columns,
                    data: value!,
                  });
                })
                .then(() => setLoading(false));
            }}
            value={[]}
            showFileSize
            showFileLastModified
            i18nStrings={{
              uploadButtonText: () => "Upload file",
              dropzoneText: () => "Drop file to upload",
              removeFileAriaLabel: () => "Remove file",
              limitShowFewer: "Show fewer files",
              limitShowMore: "Show more files",
              errorIconAriaLabel: "Error",
              formatFileLastModified: (e) =>
                e.toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                }),
            }}
          />
        }
      />
    </>
  );
}
