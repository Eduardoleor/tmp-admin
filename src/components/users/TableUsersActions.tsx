import { Box } from "@/components/system/Box";
import { Button } from "@nextui-org/react";

type TableUsersActionsProps = {
  handleOpenModalAddUsers: () => void;
};

const TableUsersActions = ({
  handleOpenModalAddUsers,
}: TableUsersActionsProps) => {
  return (
    <Box
      css={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        mb: 15,
      }}
    >
      <Button onPress={handleOpenModalAddUsers}>Add User</Button>
    </Box>
  );
};

export default TableUsersActions;
