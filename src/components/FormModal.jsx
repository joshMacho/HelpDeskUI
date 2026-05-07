import { Modal } from "antd";

export default function FormModal({ open, onClose, children }) {
  return (
    <Modal
      header={null}
      closable={true}
      open={open}
      onCancel={onClose}
      className="update-modal"
    >
      {children}
    </Modal>
  );
}
