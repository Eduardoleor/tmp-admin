import { Button, Link, Navbar, Text } from "@nextui-org/react";

const Nav = () => {
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
          <Button auto as={Link} flat href="#">
            Sign Up
          </Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};

export default Nav;
