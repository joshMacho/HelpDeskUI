import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api";
import { Descriptions, message, Modal } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";

export default function AssignDetailsModal({ open, close, info }) {
  const [details, setDetails] = useState({
    data: {},
    loading: true,
  });
  const [messageApi, content] = message.useMessage();

  useEffect(() => {
    fetchDetails();
  }, []);

  // fetch details
  const fetchDetails = async () => {
    try {
      const response = await api.get(`/devicetrail/${info}`);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to load details`,
        );
      setDetails((prev) => ({ ...prev, data: response?.data?.data }));
    } catch (error) {
      toast.error(error?.response?.data?.error || `Error getting details`);
    } finally {
      setDetails((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <Modal
      header={`Assign Details`}
      closable={true}
      open={open}
      onCancel={close}
      footer={null}
      maskClosable={false}
      className="custom-modal"
      loading={details.loading}
      width={"fit-content"}
      styles={{ content: { maxWidth: "90vw" } }}
      column={{ xs: 1, sm: 2, md: 3 }}
    >
      {content}
      <div>
        <Descriptions title={`Details`} bordered className="custom-desc">
          <DescriptionsItem label="Device">
            {details?.data?.assigned_device}
          </DescriptionsItem>
          <DescriptionsItem label="User">
            {details?.data?.assigned_user}
          </DescriptionsItem>
          <DescriptionsItem label="Comments">
            {details?.data?.comments}
          </DescriptionsItem>
        </Descriptions>
      </div>
    </Modal>
  );
}
