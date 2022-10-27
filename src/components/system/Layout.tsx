import { ReactNode } from "react";

import DialogModal from "@/components/system/DialogModal";
import Snack from "@/components/system/Snack";
import { Box } from "@mui/material";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      {children}
      <DialogModal />
      <Snack />
    </Box>
  );
};
export default Layout;
