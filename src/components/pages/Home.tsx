import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookies } from "cookies-next";
import { useSnackbar } from "react-simple-snackbar";

import ModalPackingsDelete from "@/components/packings/ModalPackingsDelete";
import TablePackings from "@/components/packings/TablePackings";
import TablePackingsActions from "@/components/packings/TablePackingsActions";
import { Box } from "@/components/system/Box";
import Layout from "@/components/system/Layout";
import { Loading, Text } from "@nextui-org/react";

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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<[] | any>([]);
  const [fileSelected, setFileSelected] = useState<File[] | null>(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [openSnackbar] = useSnackbar();
  const cookies = getCookies();
  const token = cookies?.token;
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth/sign_in");
    }
    setLoading(false);
  }, [router, token]);

  const getPackings = () => {
    setLoading(true);
    axios("/api/packings/list")
      .then((res) => {
        const sortedIPackings = res.data?.data?.sort((p1: any, p2: any) =>
          p1.id < p2.id ? 1 : p1.id > p2.id ? -1 : 0
        );
        setData(sortedIPackings);
      })
      .catch((err) => openSnackbar(err?.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const handleUpload = () => {
    if (fileSelected) {
      setLoading(true);
      const formData = new FormData();
      formData.append("blob", fileSelected[0], "file");
      axios({
        method: "post",
        url: "/api/packings/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          openSnackbar(res.data?.message);
          setFileSelected(null);
          getPackings();
        })
        .catch((err) => openSnackbar(err.response?.data?.message))
        .finally(() => setLoading(false));
    }
  };

  const handleDownload = () => {
    setLoading(true);
    axios("/api/packings/download", { responseType: "blob" })
      .then((res) => {
        const file = window.URL.createObjectURL(res.data);
        window.location.assign(file);
        openSnackbar("Downloaded successfully");
      })
      .catch((err) => openSnackbar(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    router.push("/packings/add");
  };

  const handleDelete = () => {
    setLoading(true);
    axios
      .delete("/api/packings/delete")
      .then((res) => {
        openSnackbar(res.data?.message);
        setOpenModalDelete(false);
        getPackings();
      })
      .catch((err) => openSnackbar(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const handleUpdate = (packing: Packing) => {
    router.push({
      pathname: `/packings/edit`,
      query: packing,
    });
  };

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
      <Text size="$xl" css={{ my: 20 }}>
        List of Packings
      </Text>
      <TablePackingsActions
        onAdd={handleAdd}
        onUpdate={handleUpload}
        onDownload={handleDownload}
        onDelete={() => setOpenModalDelete(true)}
        onSelectedFile={(file) => setFileSelected(file)}
        fileSelected={fileSelected}
        data={data}
      />
      <TablePackings onSetData={setData} onEditPacking={handleUpdate} />
      <ModalPackingsDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleDelete}
        password={process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string}
      />
    </Layout>
  );
};

export default Home;
