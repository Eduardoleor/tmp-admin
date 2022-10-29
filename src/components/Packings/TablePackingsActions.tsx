import { useRef } from "react";
import {
  Delete,
  PaperDownload,
  PaperPlus,
  PaperUpload,
  Plus,
} from "react-iconly";

import { Box } from "@/components/system/Box";
import { Button, Input, Text } from "@nextui-org/react";

type TablePackingsActionsProps = {
  onAdd: () => void;
  onUpdate: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onSelectedFile: (file: File[]) => void;
  fileSelected: File[] | null;
  data: [];
};

const TablePackingsActions = ({
  onAdd,
  onUpdate,
  onDownload,
  onDelete,
  onSelectedFile,
  fileSelected,
  data,
}: TablePackingsActionsProps) => {
  const fileUpload = useRef<any>(null);

  const handleSelectedFile = (event: any) => {
    const files = event.target.files;
    onSelectedFile(files);
  };

  const handleFireFile = () => {
    if (fileUpload.current) {
      fileUpload.current?.click();
    }
  };

  return (
    <Box
      css={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 15,
      }}
    >
      <Box>
        <Input
          placeholder="Select file"
          type="file"
          multiple={false}
          ref={fileUpload}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleSelectedFile}
          css={{ display: "none" }}
        />
        <Box css={{ display: "flex", alignItems: "center", mb: 10 }}>
          <Button light onPress={handleFireFile} icon={<PaperPlus />}>
            Select File
          </Button>
          {fileSelected && (
            <Text size="$sm" b color="$primary">
              File Selected: {fileSelected[0]?.name}
            </Text>
          )}
        </Box>
        <Button
          auto
          flat
          icon={<PaperUpload set="bold" style={{ paddingRight: 5 }} />}
          onPress={onUpdate}
          disabled={!fileSelected}
        >
          Update file report
        </Button>
      </Box>
      <Box css={{ display: "flex", gap: 20 }}>
        <Button
          auto
          flat
          color="primary"
          icon={<Plus set="bold" style={{ paddingRight: 5 }} />}
          onPress={onAdd}
          disabled={!data?.length}
        >
          Added new packing
        </Button>
        <Button
          auto
          flat
          color="secondary"
          icon={<PaperDownload set="bold" style={{ paddingRight: 5 }} />}
          onPress={onDownload}
          disabled={!data?.length}
        >
          Download table report
        </Button>
        <Button
          auto
          flat
          color="warning"
          icon={<Delete set="bold" style={{ paddingRight: 5 }} />}
          onPress={onDelete}
          disabled={!data?.length}
        >
          Delete table report
        </Button>
      </Box>
    </Box>
  );
};

export default TablePackingsActions;
