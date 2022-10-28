import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";

import { Button, Link, Navbar, Text } from "@nextui-org/react";

const Nav = () => {
  const router = useRouter();

  const handleSignOut = () => {
    deleteCookie("user");
    deleteCookie("token");
    router.push("/auth/sign_in");
  };

  return (
    <Navbar isBordered variant="floating" maxWidth="fluid">
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          TMP | Administrator
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="underline" enableCursorHighlight>
        <Navbar.Link isActive href="#">
          Packings
        </Navbar.Link>
        <Navbar.Link href="#">Users</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <Button color="error" auto as={Link} light onPress={handleSignOut}>
            Sign Out
          </Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};

export default Nav;
