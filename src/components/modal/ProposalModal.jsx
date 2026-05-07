import { Modal } from "antd";
import SendProposalForm from "../forms/SendProposalForm";

export default function ProposalModal({ open, onClose, onSuccess }) {
  return (
    <Modal
      header={null}
      footer={null}
      open={open}
      onCancel={onClose}
      className=""
    >
      <SendProposalForm onSuccess={onSuccess} />
    </Modal>
  );
}
