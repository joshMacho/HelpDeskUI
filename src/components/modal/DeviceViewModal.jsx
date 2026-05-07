import { Descriptions, Modal } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import dayjs from "dayjs";

export default function DeviceViewModal({ info, open, onClose }) {
  return (
    <Modal
      header={null}
      closable={true}
      open={open}
      onCancel={onClose}
      footer={null}
      className=""
      width={"auto"}
      //   style={{ maxWidth: 900, width: "90vw" }}
    >
      <Descriptions title={`${info?.type || "Device"} details`} bordered>
        <DescriptionsItem label="Serial Number">{info.sn}</DescriptionsItem>
        <DescriptionsItem label="Type">{info.type}</DescriptionsItem>
        <DescriptionsItem label="Make">{info.make}</DescriptionsItem>
        <DescriptionsItem label="Model">{info.model}</DescriptionsItem>
        <DescriptionsItem label="Processor">
          {info?.cpu || "N/A"}
        </DescriptionsItem>
        <DescriptionsItem label="Operating System">{info.os}</DescriptionsItem>

        <DescriptionsItem label="Ram Size">
          {info?.ramSize || "N/A"}
        </DescriptionsItem>
        <DescriptionsItem label="Storage Type">
          {info.storageType}
        </DescriptionsItem>
        <DescriptionsItem label="Storage Size">
          {info?.storageSize || "N/A"}
        </DescriptionsItem>
        <DescriptionsItem label="IP Address">
          {info?.ipAddress || "0.0.0.0"}
        </DescriptionsItem>
        <DescriptionsItem label="Price">GHS {info.price}</DescriptionsItem>
        <DescriptionsItem label="Location">
          {info?.location || "N/A"}
        </DescriptionsItem>
        <DescriptionsItem label="Status">
          {info.lifeCycleStatus}
        </DescriptionsItem>
        <DescriptionsItem label="Created by">
          {info.created_by}
        </DescriptionsItem>
        <DescriptionsItem label="Date Purchased">
          {dayjs(info.datePurchased).format("DD-MMMM-YYYY")}
        </DescriptionsItem>
      </Descriptions>
    </Modal>
  );
}
