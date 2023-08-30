import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  Modal,
  FormField,
  Input,
  Box,
  SpaceBetween,
  Button,
  Form,
  TextContent,
  Alert,
} from "@cloudscape-design/components";
import {
  AnalysisDialogContext,
  StateFlashbarContext,
} from "../../../utils/providers";
import { AnalysisModel } from "../../../models/quantitative-model";
import {
  useDeleteAnalysis,
  useUpdateAnalysis,
} from "../../../services/quantitatives/analysis-service";

export function AnalysisDialog({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { type, data } = useContext(AnalysisDialogContext);

  switch (type) {
    case "modify":
      return (
        <ModifyDialog data={data!} visible={visible} setVisible={setVisible} />
      );
    case "delete":
      return (
        <DeleteDialog data={data!} visible={visible} setVisible={setVisible} />
      );
  }
}

const ModifyDialog = ({
  data,
  visible,
  setVisible,
}: {
  data: AnalysisModel;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { updateTrigger, isUpdating } = useUpdateAnalysis(
    data.id!.toString(),
    data.quantitative_id!.toString()
  );
  const [analysis, setAnalysis] = useState(data);
  const [error, setError] = useState<string | undefined>();
  const setMessages = useContext(StateFlashbarContext);

  const onSubmit = async () => {
    try {
      await updateTrigger({
        name: analysis.name,
        type: data.type,
      });
      setVisible(false);
      setMessages([
        {
          type: "success",
          content: "Analysis updated successfully.",
        },
      ]);
    } catch (err) {
      setError(`${err}`);
    }
  };

  const onDismiss = () => {
    setError(undefined);
    setVisible(false);
  };

  return (
    <Modal
      onDismiss={onDismiss}
      visible={visible}
      header={"Modify the analysis details"}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} loading={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form errorText={error}>
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Name" description="Your analysis name">
            <Input
              value={analysis.name}
              onChange={({ detail }) => {
                setAnalysis({ ...analysis, name: detail.value });
              }}
            />
          </FormField>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};

const DeleteDialog = ({
  data,
  visible,
  setVisible,
}: {
  data: AnalysisModel;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { deleteTrigger, isDeleting } = useDeleteAnalysis(
    data.id!.toString(),
    data.quantitative_id!.toString()
  );
  const [error, setError] = useState<string | undefined>();
  const setMessages = useContext(StateFlashbarContext);

  const onSubmit = async () => {
    try {
      await deleteTrigger();
      setVisible(false);
      setMessages([
        {
          type: "success",
          content: "Analysis deleted successfully.",
        },
      ]);
    } catch (err) {
      setError(`${err}`);
    }
  };

  const onDismiss = () => {
    setError(undefined);
    setVisible(false);
  };

  return (
    <Modal
      onDismiss={onDismiss}
      visible={visible}
      header={"Delete the analysis"}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} loading={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form errorText={error}>
        <SpaceBetween direction="vertical" size="l">
          <TextContent>Are you sure want to delete analysis?</TextContent>
          <Alert statusIconAriaLabel="Warning" type="warning">
            This will permanently delete <b>{data.name}</b>.
          </Alert>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};
