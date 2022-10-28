import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookies } from "cookies-next";

import TablePackings from "@/components/packings/TablePackings";
import { Box } from "@/components/system/Box";
import Layout from "@/components/system/Layout";
import { Button, Loading, Navbar, Text } from "@nextui-org/react";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const cookies = getCookies();
  const token = cookies?.token;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth/sign_in");
    }
    setLoading(false);
  }, [router, token]);

  if (loading) {
    return (
      <Box
        css={{
          display: "flex",
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading size="lg">Loading...</Loading>
      </Box>
    );
  }

  return (
    <Layout>
      <Text size="$xl" css={{ mb: 10 }}>
        List of Packings
      </Text>
      <TablePackings />
    </Layout>
  );
};

export default Home;
