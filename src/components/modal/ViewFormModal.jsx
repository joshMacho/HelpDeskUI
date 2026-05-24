import { Modal } from "antd";
import ViewDocument from "../forms/ViewDoc";

export default function ViewFormModal({ open, onClose, schema, data }) {
  return (
    <Modal
      header={null}
      footer={null}
      open={open}
      onCancel={onClose}
      className=""
      width={"auto"}
    >
      <ViewDocument schema={schema} data={data} />
    </Modal>
  );
}
