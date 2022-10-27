import TablePackings from "@/components/packings/TablePackings";
import Layout from "@/components/system/Layout";
import { Button, Navbar, Text } from "@nextui-org/react";

const Home = () => {
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
