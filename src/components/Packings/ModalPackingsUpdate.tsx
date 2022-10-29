import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { v4 } from "uuid";

import { isValidObj } from "@/utils/data";
import { Button, Input, Modal, Text } from "@nextui-org/react";

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

type ModalPackingsUpdateProps = {
  open: boolean;
  type: "add" | "update" | null;
  onClose: () => void;
  onConfirm: (packing: Packing) => void;
  packing: Packing | null;
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

const ModalPackingsUpdate = ({
  open,
  type,
  onClose,
  onConfirm,
  packing,
}: ModalPackingsUpdateProps) => {
  const [packingSelected, setPackingSelected] =
    useState<Packing>(defaultPacking);
  const [typeSelected, setTypeSelected] = useState<"add" | "update" | null>(
    null
  );

  useEffect(() => {
    if (packing && type === "update") {
      setPackingSelected(packing);
    } else {
      setPackingSelected(defaultPacking);
    }
  }, [packing, type]);

  useEffect(() => {
    if (type) {
      setTypeSelected(type);
    }
  }, [type]);

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      scroll
      animated={false}
      open={open}
      onClose={onClose}
    >
      <Modal.Header>
        {typeSelected === "update" ? (
          <Text id="modal-title" size={18}>
            Update Packing: <b>{packingSelected?.packingdiskno}</b>
          </Text>
        ) : (
          <Text id="modal-title" size={18}>
            Added new Packing
          </Text>
        )}
      </Modal.Header>
      <Modal.Body css={{ py: 30, gap: 30 }}>
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
            setPackingSelected({ ...packingSelected, vendorno: e.target.value })
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
          labelPlaceholder="Quanity"
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
            setPackingSelected({ ...packingSelected, updateat: e.target.value })
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
      </Modal.Body>
      <Modal.Footer>
        <Button light size="sm" onClick={onClose}>
          Close
        </Button>
        <Button
          flat
          size="sm"
          onClick={() => onConfirm(packingSelected)}
          disabled={typeSelected === "add" && !isValidObj(packingSelected)}
        >
          {typeSelected === "update" ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPackingsUpdate;
