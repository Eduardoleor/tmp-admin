import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookies, setCookies } from "cookies-next";

import { Box } from "@/components/system/Box";
import {
  Button,
  Card,
  Container,
  Input,
  Loading,
  Text,
} from "@nextui-org/react";

const SignIn = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({
    id: "",
    password: "",
  });

  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);

  const cookies = getCookies();
  const token = cookies?.token;
  const router = useRouter();

  const handleSignIn = useCallback(() => {
    setLoadingUser(true);

    const params = {
      user: session.id,
      password: session.password,
      from: "web",
    };

    axios("/api/auth/session", { params })
      .then((res) => {
        if (res.data) {
          const data = res.data;
          const user = data.user;
          setCookies("user", { user: user });
          setCookies("token", { token: user.jwt, user: user });
          setErrorUser(null);
          router.push("/");
        }
      })
      .catch((err) => {
        setErrorUser(err.response?.data?.message);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [router, session.id, session.password]);

  useEffect(() => {
    if (token) {
      router.push("/");
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
        <Loading size="md">Loading...</Loading>
      </Box>
    );
  }

  return (
    <Container>
      <Box
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          gap: 15,
        }}
      >
        <Card css={{ mw: "500px" }}>
          <Card.Header>
            <Text size="$2xl">Sign In</Text>
          </Card.Header>
          <Card.Body css={{ gap: 20 }}>
            <Input
              label="Employee ID"
              placeholder="12847281"
              type="number"
              value={session.id}
              onChange={(e) => setSession({ ...session, id: e.target.value })}
            />
            <Input.Password
              label="Password"
              placeholder="******"
              type="password"
              value={session.password}
              onChange={(e) =>
                setSession({ ...session, password: e.target.value })
              }
            />
          </Card.Body>
          <Card.Footer css={{ display: "flex", flexDirection: "column" }}>
            <Button
              size="md"
              css={{ width: "100%" }}
              disabled={
                session.id === "" || session.password === "" || loadingUser
              }
              onPress={handleSignIn}
            >
              {loadingUser ? <Loading /> : "Sign In"}
            </Button>
            <Text color="$error" css={{ mt: 15, mb: 10 }}>
              {errorUser}
            </Text>
          </Card.Footer>
        </Card>
      </Box>
    </Container>
  );
};

export default SignIn;
