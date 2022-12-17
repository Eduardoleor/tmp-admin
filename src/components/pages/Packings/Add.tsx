import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookies } from "cookies-next";
import dayjs from "dayjs";
import { ChevronLeftCircle } from "react-iconly";
import { useSnackbar } from "react-simple-snackbar";
import { v4 } from "uuid";

import { Box } from "@/components/system/Box";
import Layout from "@/components/system/Layout";
import { isValidObj } from "@/utils/data";
import { Button, Card, Input, Loading, Text } from "@nextui-org/react";

type Packing = {
  id: string;
  balloonnumber: string;
  buildsequence: string;
  linea: string;
  packingdiskno: string;
  partnumber: string;
  pono: string;
  qty: string;
  scannedby: string;
  updateat: string;
  vendorno: string;
};

const defaultPacking: Packing = {
  id: v4(),
  balloonnumber: "",
  buildsequence: "",
  linea: "",
  packingdiskno: "",
  partnumber: "",
  pono: "",
  qty: "",
  scannedby: "0",
  updateat: String(new Date()),
  vendorno: "",
};

const Add = () => {
  const [loading, setLoading] = useState(true);
  const [packingSelected, setPackingSelected] =
    useState<Packing>(defaultPacking);

  const [openSnackbar] = useSnackbar();
  const cookies = getCookies();
  const token = cookies?.token;
  const router = useRouter();

  const onAdd = () => {
    setLoading(true);
    axios
      .post("/api/packings/table/add", null, { params: packingSelected })
      .then((res) => {
        openSnackbar(res.data?.message + " ✅");
        router.back();
      })
      .catch((err) => openSnackbar(err.response?.data?.message))
      .finally(() => {
        setLoading(false);
      });
  };

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
        <Loading size="md">Loading...</Loading>
      </Box>
    );
  }

  return (
    <Layout>
      <Button
        flat
        color="secondary"
        onPress={() => router.back()}
        css={{ mb: 20 }}
      >
        <ChevronLeftCircle
          set="bold"
          primaryColor="blueviolet"
          style={{ marginRight: 10 }}
        />
        Go back
      </Button>
      <Card>
        <Card.Header>
          <Text size="$xl" css={{ my: 20 }}>
            Add new Packing
          </Text>
        </Card.Header>
        <Card.Body style={{ paddingTop: 30, gap: 40 }}>
          <Input
            disabled
            aria-label="packingSelected-input-id"
            labelPlaceholder="ID"
            value={packingSelected?.id}
            onChange={(e) =>
              setPackingSelected({ ...packingSelected, id: e.target.value })
            }
          />
          <Input
            aria-label="partnumber-input-id"
            labelPlaceholder="Part Number"
            type="text"
            value={packingSelected?.partnumber}
            onChange={(e) =>
              setPackingSelected({
                ...packingSelected,
                partnumber: e.target.value,
              })
            }
          />
          <Input
            aria-label="buildsequence-input-id"
            labelPlaceholder="Build Sequence"
            type="number"
            value={packingSelected?.buildsequence}
            onChange={(e) =>
              setPackingSelected({
                ...packingSelected,
                buildsequence: e.target.value,
              })
            }
          />
          <Input
            aria-label="balloonnumber-input-id"
            labelPlaceholder="Ballon Number"
            type="text"
            value={packingSelected?.balloonnumber}
            onChange={(e) =>
              setPackingSelected({
                ...packingSelected,
                balloonnumber: e.target.value,
              })
            }
          />
          <Input
            aria-label="vendorno-input-id"
            labelPlaceholder="Vendor No."
            type="number"
            value={packingSelected?.vendorno}
            onChange={(e) =>
              setPackingSelected({
                ...packingSelected,
                vendorno: e.target.value,
              })
            }
          />
          <Input
            animated={false}
            aria-label="packingdiskno-input-id"
            labelPlaceholder="Packing Disk No."
            type="number"
            value={packingSelected?.packingdiskno}
            onChange={(e) =>
              setPackingSelected({
                ...packingSelected,
                packingdiskno: e.target.value,
              })
            }
          />
          <Input
            aria-label="linea-input-id"
            labelPlaceholder="Line"
            type="text"
            value={packingSelected?.linea}
            onChange={(e) =>
              setPackingSelected({ ...packingSelected, linea: e.target.value })
            }
          />
          <Input
            aria-label="pono-input-id"
            labelPlaceholder="PO No."
            type="number"
            value={packingSelected?.pono}
            onChange={(e) =>
              setPackingSelected({ ...packingSelected, pono: e.target.value })
            }
          />
          <Input
            animated={false}
            aria-label="qty-input-id"
            labelPlaceholder="Quantity"
            type="number"
            value={packingSelected?.qty}
            onChange={(e) =>
              setPackingSelected({ ...packingSelected, qty: e.target.value })
            }
          />
          <Input
            disabled
            aria-label="updateat-input-id"
            labelPlaceholder="Update At"
            initialValue={dayjs(packingSelected?.updateat).format("DD/MM/YYYY")}
            onChange={(e) =>
              setPackingSelected({
                ...packingSelected,
                updateat: e.target.value,
              })
            }
          />
          <Input
            disabled
            aria-label="scannedby-input-id"
            labelPlaceholder="Scanned By"
            type="number"
            value={packingSelected?.scannedby}
            onChange={(e) =>
              setPackingSelected({
                ...packingSelected,
                scannedby: e.target.value,
              })
            }
          />
        </Card.Body>
        <Card.Footer>
          <Button
            flat
            size="lg"
            css={{ w: "100%", mb: 20 }}
            onClick={() => onAdd()}
            disabled={!isValidObj(packingSelected)}
          >
            Add packing
          </Button>
        </Card.Footer>
      </Card>
    </Layout>
  );
};

export default Add;
