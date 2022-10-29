import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookies, setCookies } from "cookies-next";
import { AES } from "crypto-js";

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
    email: "",
    password: "",
  });

  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);

  const cookies = getCookies();
  const token = cookies?.token;
  const router = useRouter();

  const handleSignIn = useCallback(() => {
    setLoadingUser(true);

    const cipherPassword = AES.encrypt(
      session.password,
      process.env.NEXT_PUBLIC_KEY_CYPHER as string
    ).toString();

    const params = {
      user: session.email,
      password: cipherPassword,
    };

    axios("/api/auth/session", { params })
      .then((res) => {
        setErrorUser(null);
        if (res.data) {
          const user = res.data;
          setCookies("user", { user });
          setCookies("token", { token: user.jwt });
          router.push("/");
        }
      })
      .catch((err) => setErrorUser(err.response?.data?.message))
      .finally(() => setLoadingUser(false));
  }, [router, session.email, session.password]);

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
              label="Email"
              placeholder="user@gmail.com"
              type="email"
              value={session.email}
              onChange={(e) =>
                setSession({ ...session, email: e.target.value })
              }
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
                session.email === "" || session.password === "" || loadingUser
              }
              onPress={handleSignIn}
            >
              {loadingUser ? <Loading /> : "Sign In"}
            </Button>
            {errorUser && (
              <Text color="$error" css={{ mt: 15, mb: 10 }}>
                {errorUser}
              </Text>
            )}
          </Card.Footer>
        </Card>
      </Box>
    </Container>
  );
};

export default SignIn;
