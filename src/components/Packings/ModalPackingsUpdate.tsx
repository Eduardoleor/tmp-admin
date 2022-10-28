import dayjs from "dayjs";

import { Button, Input, Modal, Text } from "@nextui-org/react";

type ModalPackingsUpdateProps = {
  open: boolean;
  packing: {
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
  } | null;
  onClose: () => void;
  onConfirm: () => void;
  onUpdate: (data: {
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
  }) => void;
};

const ModalPackingsUpdate = ({
  open,
  packing,
  onClose,
  onConfirm,
  onUpdate,
}: ModalPackingsUpdateProps) => {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      scroll
      open={open}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Update Packing: <b>{packing?.packingdiskno}</b>
        </Text>
      </Modal.Header>
      {packing && (
        <Modal.Body css={{ py: 30, gap: 30 }}>
          <Input
            disabled
            labelPlaceholder="ID"
            value={packing?.id}
            onChange={(e) => onUpdate({ ...packing, id: e.target.value })}
          />
          <Input
            labelPlaceholder="Part Number"
            value={packing?.partnumber}
            onChange={(e) =>
              onUpdate({ ...packing, partnumber: e.target.value })
            }
          />
          <Input
            labelPlaceholder="Build Sequence"
            value={packing?.buildsequence}
            onChange={(e) =>
              onUpdate({ ...packing, buildsequence: e.target.value })
            }
          />
          <Input
            labelPlaceholder="Ballon Number"
            value={packing?.balloonnumber}
            onChange={(e) =>
              onUpdate({ ...packing, balloonnumber: e.target.value })
            }
          />
          <Input
            labelPlaceholder="Vendor No."
            value={packing?.vendorno}
            onChange={(e) => onUpdate({ ...packing, vendorno: e.target.value })}
          />
          <Input
            labelPlaceholder="Packing Disk No."
            value={packing?.packingdiskno}
            onChange={(e) =>
              onUpdate({ ...packing, packingdiskno: e.target.value })
            }
          />
          <Input
            labelPlaceholder="Line"
            value={packing?.linea}
            onChange={(e) => onUpdate({ ...packing, linea: e.target.value })}
          />

          <Input
            labelPlaceholder="PO No."
            value={packing?.pono}
            onChange={(e) => onUpdate({ ...packing, pono: e.target.value })}
          />
          <Input
            labelPlaceholder="Quanity"
            value={packing?.qty}
            onChange={(e) => onUpdate({ ...packing, qty: e.target.value })}
          />
          <Input
            disabled
            labelPlaceholder="Update At"
            initialValue={dayjs(packing?.updateat).format("DD/MM/YYYY")}
            onChange={(e) => onUpdate({ ...packing, updateat: e.target.value })}
          />
          <Input
            disabled
            labelPlaceholder="Scanned By"
            value={packing?.scannedby}
            onChange={(e) =>
              onUpdate({ ...packing, scannedby: e.target.value })
            }
          />
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button light size="sm" onClick={onClose}>
          Close
        </Button>
        <Button flat size="sm" onClick={onConfirm}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPackingsUpdate;
