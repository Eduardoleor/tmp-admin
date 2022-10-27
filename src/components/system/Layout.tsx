import { ReactNode } from "react";

import { Box } from "@/components/system/Box";
import DialogModal from "@/components/system/DialogModal";
import { Container } from "@nextui-org/react";

import Footer from "./Footer";
import Nav from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      css={{
        maxW: "100%",
      }}
    >
      <DialogModal />
      <Container>
        <Nav />
        <Box css={{ m: 20 }}>
          {children}
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};
export default Layout;
