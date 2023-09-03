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
  ResearchModel,
  copyResearchModel,
} from "../../../models/research-model";
import {
  useDeleteResearch,
  usePostResearch,
  useUpdateResearch,
} from "../../../services/researches/research-service";
import {
  ResearchDialogContext,
  StateFlashbarContext,
} from "../../../utils/providers";

export function ResearchDialog({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const { type, data } = useContext(ResearchDialogContext);

  switch (type) {
    case "create":
      return (
        <CreateDialog data={data!} visible={visible} setVisible={setVisible} />
      );
    case "update":
      return (
        <UpdateDialog data={data!} visible={visible} setVisible={setVisible} />
      );
    case "delete":
      return (
        <DeleteDialog data={data!} visible={visible} setVisible={setVisible} />
      );
  }
}

const CreateDialog = ({
  data,
  visible,
  setVisible,
}: {
  data: ResearchModel;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { postTrigger, isPosting } = usePostResearch();
  const [research, setResearch] = useState(data);
  const [error, setError] = useState<string | undefined>();
  const setMessages = useContext(StateFlashbarContext);

  const onSubmit = async () => {
    try {
      await postTrigger({
        name: research.name,
        description: research.description,
      });
      setVisible(false);
      setMessages([
        {
          type: "success",
          content: "Project created successfully.",
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
      header={"Start a new project"}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} loading={isPosting}>
              {isPosting ? "Creating..." : "Create"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form errorText={error}>
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Name" description="Your project name">
            <Input
              value={research.name}
              onChange={({ detail }) => {
                setResearch(
                  copyResearchModel(research, { name: detail.value })
                );
              }}
            />
          </FormField>
          <FormField
            label="Description"
            description="The description of your project"
          >
            <Input
              value={research.description}
              onChange={({ detail }) => {
                setResearch(
                  copyResearchModel(research, { description: detail.value })
                );
              }}
            />
          </FormField>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};

const UpdateDialog = ({
  data,
  visible,
  setVisible,
}: {
  data: ResearchModel;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { updateTrigger, isUpdating } = useUpdateResearch(data.id!);
  const [research, setResearch] = useState(data);
  const [error, setError] = useState<string | undefined>();
  const setMessages = useContext(StateFlashbarContext);

  const onSubmit = async () => {
    try {
      await updateTrigger({
        name: research.name,
        description: research.description,
      });
      setVisible(false);
      setMessages([
        {
          type: "success",
          content: "Project updated successfully.",
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
      header={"Modify the project details"}
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
          <FormField label="Name" description="Your project name">
            <Input
              value={research.name}
              onChange={({ detail }) => {
                setResearch(
                  copyResearchModel(research, { name: detail.value })
                );
              }}
            />
          </FormField>
          <FormField
            label="Description"
            description="The description of your project"
          >
            <Input
              value={research.description}
              onChange={({ detail }) => {
                setResearch(
                  copyResearchModel(research, { description: detail.value })
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
  data: ResearchModel;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { deleteTrigger, isDeleting } = useDeleteResearch(data.id!);
  const [error, setError] = useState<string | undefined>();
  const setMessages = useContext(StateFlashbarContext);

  const onSubmit = async () => {
    try {
      await deleteTrigger();
      setVisible(false);
      setMessages([
        {
          type: "success",
          content: "Project deleted successfully.",
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
      header={"Delete the project"}
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
          <TextContent>Are you sure want to delete project?</TextContent>
          <Alert statusIconAriaLabel="Warning" type="warning">
            This will permanently delete <b>{data.name}</b>.
          </Alert>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};
