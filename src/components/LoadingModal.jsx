import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";

export default function LoadingModal({ message, open }) {
  return (
    <Modal
      header={null}
      closable={false}
      open={open}
      footer={null}
      width={300}
      className="custom-modal"
    >
      <div className="mod-content">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <p>{message}</p>
      </div>
    </Modal>
  );
}
