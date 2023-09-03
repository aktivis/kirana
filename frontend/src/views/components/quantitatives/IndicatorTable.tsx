import {
  Table,
  Box,
  Input,
  Select,
  CollectionPreferences,
} from "@cloudscape-design/components";
import {
  QuantitativeModel,
  IndicatorRole,
  IndicatorType,
} from "../../../models/quantitative-model";
import { Dispatch, SetStateAction } from "react";
import {
  handleIndicatorPreferences,
  handleIndicatorProps,
} from "../../../controllers/quantitative-controller";

export default function IndicatorTable({
  quantitative,
  setQuantitative,
}: {
  quantitative: QuantitativeModel;
  setQuantitative: Dispatch<SetStateAction<QuantitativeModel>>;
}) {
  const typeOptions = Object.values(IndicatorType).map((e) => ({ value: e }));
  const roleOptions = Object.values(IndicatorRole).map((e) => ({ value: e }));

  return (
    <>
      <Table
        items={quantitative.indicators
          .filter((e) => e.visibility)
          .sort((a, b) => a.order - b.order)}
        sortingDisabled
        stripedRows
        stickyHeader
        loadingText="Loading resources"
        variant="borderless"
        submitEdit={(item, column, newValue) => {
          handleIndicatorProps(
            item,
            column,
            newValue,
            quantitative,
            setQuantitative
          );
        }}
        empty={
          <Box padding={{ bottom: "s" }} variant="p" color="inherit">
            No data to display.
          </Box>
        }
        header={
          <Box float="right">
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                contentDisplay: quantitative.indicators
                  .sort((a, b) => a.order - b.order)
                  .map((e) => ({
                    id: (e.id ?? e.order).toString(),
                    visible: e.visibility,
                  })),
              }}
              contentDisplayPreference={{
                title: "Order & Visibility",
                description:
                  "Reorder column with the icon and/or change visibility with the switch.",
                options: quantitative.indicators
                  .sort((a, b) => a.order - b.order)
                  .map((e) => ({
                    id: (e.id ?? e.order).toString(),
                    label: e.alias,
                  })),
              }}
              onConfirm={({ detail }) =>
                handleIndicatorPreferences(
                  detail,
                  quantitative,
                  setQuantitative
                )
              }
            />
          </Box>
        }
        columnDefinitions={[
          {
            id: "alias",
            header: "Name",
            width: 200,
            cell: (item) => {
              return item.alias;
            },
            editConfig: {
              editingCell: (item, { currentValue, setValue }) => {
                return (
                  <Input
                    autoFocus={true}
                    value={currentValue ?? item.alias}
                    onChange={(e) => setValue(e.detail.value)}
                  />
                );
              },
            },
          },
          {
            id: "type",
            header: "Type",
            width: 200,
            cell: (item) => {
              return item.type;
            },
            editConfig: {
              editingCell: (item, { currentValue, setValue }) => {
                const value = currentValue ?? item.type;
                return (
                  <Select
                    autoFocus={true}
                    expandToViewport={true}
                    selectedOption={
                      typeOptions.find((e) => e.value === value) ?? null
                    }
                    onChange={(e) => {
                      setValue(e.detail.selectedOption.value ?? item.type);
                    }}
                    options={typeOptions}
                  />
                );
              },
            },
          },
          {
            id: "role",
            header: "Role",
            width: 200,
            cell: (item) => {
              return item.role;
            },
            editConfig: {
              editingCell: (item, { currentValue, setValue }) => {
                const value = currentValue ?? item.role;
                return (
                  <Select
                    autoFocus={true}
                    expandToViewport={true}
                    selectedOption={
                      roleOptions.find((e) => e.value === value) ?? null
                    }
                    onChange={(e) => {
                      setValue(e.detail.selectedOption.value ?? item.role);
                    }}
                    options={roleOptions}
                  />
                );
              },
            },
          },
        ]}
      />
    </>
  );
}
