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
  QuantitativeDialogContext,
  StateFlashbarContext,
} from "../../../utils/providers";
import {
  useDeleteQuantitative,
  useUpdateQuantitative,
} from "../../../services/quantitatives/quantitative-service";
import {
  QuantitativeModel,
  copyQuantitativeModel,
} from "../../../models/quantitative-model";

export function QuantitativeDialog({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { type, data } = useContext(QuantitativeDialogContext);

  switch (type) {
    case "rename":
      return (
        <RenameDialog data={data!} visible={visible} setVisible={setVisible} />
      );
    case "delete":
      return (
        <DeleteDialog data={data!} visible={visible} setVisible={setVisible} />
      );
  }
}

const RenameDialog = ({
  data,
  visible,
  setVisible,
}: {
  data: QuantitativeModel;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { updateTrigger, isUpdating } = useUpdateQuantitative(
    data.id!.toString()
  );
  const [quantitative, setQuantitative] = useState(data);
  const [error, setError] = useState<string | undefined>();
  const setMessages = useContext(StateFlashbarContext);

  const onSubmit = async () => {
    try {
      await updateTrigger({
        id: quantitative.id,
        research_id: quantitative.research_id,
        name: quantitative.name,
      });
      setVisible(false);
      setMessages([
        {
          type: "success",
          content: "Model updated successfully.",
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
      header={"Modify the model details"}
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
          <FormField label="Name" description="Your model name">
            <Input
              value={quantitative.name}
              onChange={({ detail }) => {
                setQuantitative(
                  copyQuantitativeModel(quantitative, { name: detail.value })
                );
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
  data: QuantitativeModel;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { deleteTrigger, isDeleting } = useDeleteQuantitative(
    data.id!.toString()
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
          content: "Model deleted successfully.",
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
      header={"Delete the model"}
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
          <TextContent>Are you sure want to delete model?</TextContent>
          <Alert statusIconAriaLabel="Warning" type="warning">
            This will permanently delete <b>{data.name}</b>.
          </Alert>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};
