import { Text } from "@nextui-org/react";

import { Box } from "./Box";

const Footer = () => {
  return (
    <Box
      css={{
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
      }}
    >
      <Text>® All Rights Reserved | TMP {new Date().getFullYear()} </Text>
    </Box>
  );
};

export default Footer;
