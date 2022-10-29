import { useEffect, useState } from "react";
import dayjs from "dayjs";

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
  onClose: () => void;
  onConfirm: (packing: Packing) => void;
  packing: Packing | null;
};

const defaultPacking: Packing = {
  id: "",
  balloonnumber: "",
  buildsequence: "",
  linea: "",
  packingdiskno: "",
  partnumber: "",
  pono: "",
  qty: "",
  scannedby: "",
  updateat: "",
  vendorno: "",
};

const ModalPackingsUpdate = ({
  open,
  onClose,
  onConfirm,
  packing,
}: ModalPackingsUpdateProps) => {
  const [packingSelected, setPackingSelected] =
    useState<Packing>(defaultPacking);

  useEffect(() => {
    if (packing) {
      setPackingSelected(packing);
    }
  }, [packing]);

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
        <Text id="modal-title" size={18}>
          Update Packing: <b>{packingSelected?.packingdiskno}</b>
        </Text>
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
          value={packingSelected?.vendorno}
          onChange={(e) =>
            setPackingSelected({ ...packingSelected, vendorno: e.target.value })
          }
        />
        <Input
          animated={false}
          aria-label="packingdiskno-input-id"
          labelPlaceholder="Packing Disk No."
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
          value={packingSelected?.linea}
          onChange={(e) =>
            setPackingSelected({ ...packingSelected, linea: e.target.value })
          }
        />

        <Input
          aria-label="pono-input-id"
          labelPlaceholder="PO No."
          value={packingSelected?.pono}
          onChange={(e) =>
            setPackingSelected({ ...packingSelected, pono: e.target.value })
          }
        />
        <Input
          animated={false}
          aria-label="qty-input-id"
          labelPlaceholder="Quanity"
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
        <Button flat size="sm" onClick={() => onConfirm(packingSelected)}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPackingsUpdate;
