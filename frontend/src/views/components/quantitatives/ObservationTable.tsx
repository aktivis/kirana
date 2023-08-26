import { Table, Pagination, FileUpload } from "@cloudscape-design/components";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Observations,
  QuantitativeModel,
} from "../../../models/quantitative-model";
import { handleCSV } from "../../../controllers/quantitative-controller";
import { DSVRowString } from "d3";
import { paginate } from "../../../utils/pagination";

export default function ObservationTable({
  observations,
  setObservations,
  quantitative,
  setQuantitative,
}: {
  observations: Observations | undefined;
  setObservations: Dispatch<SetStateAction<Observations | undefined>>;
  quantitative: QuantitativeModel;
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>;
}) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { items, totalPages } = paginate(observations, page, 10);

  const handleObservations = (observations: Observations | undefined) => {
    if (observations === undefined) return [];

    const { columns } = observations;
    return columns.map((e) => ({
      header: e,
      cell: (item: DSVRowString) => item[e],
      width: 200,
    }));
  };

  return (
    <>
      <Table
        columnDefinitions={handleObservations(observations)}
        items={items}
        sortingDisabled
        stripedRows
        stickyHeader
        variant="container"
        pagination={
          observations ? (
            <Pagination
              currentPageIndex={page}
              pagesCount={totalPages}
              onChange={({ detail }) => setPage(detail.currentPageIndex)}
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
              handleCSV(detail.value[0], quantitative, setQuantitative)
                .then((value) => setObservations(value))
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
