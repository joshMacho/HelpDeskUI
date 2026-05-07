import { Modal } from "antd";
import PasswordResetForm2 from "../forms/PasswordResetForm2";

export default function ResetPasswordModal({ open, onClose, onSuccess }) {
  return (
    <Modal
      header={null}
      footer={null}
      open={open}
      onCancel={onClose}
      className=""
    >
      <PasswordResetForm2 onSuccess={onSuccess} />
    </Modal>
  );
}
