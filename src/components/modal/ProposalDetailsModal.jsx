import { Descriptions, message, Modal, Tag } from "antd";
import { useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import DescriptionsItem from "antd/es/descriptions/Item";
import { useState } from "react";
import dayjs from "dayjs";

export default function ProposalDetailsModal({ open, close, info }) {
  const [details, setDetails] = useState({
    loading: true,
    data: {},
  });
  const [messageApi, content] = message.useMessage();

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await api.get(`/proposal/${info}`);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to load details`,
        );
      setDetails((prev) => ({
        ...prev,
        loading: false,
        data: response?.data?.data,
      }));
    } catch (error) {
      console.log(`Error from loading details of proposer`, error);
      return toast.error(
        error?.response?.data?.error || `Error getting details of proposer`,
      );
    } finally {
      setDetails((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <Modal
      header={`Poposal Details`}
      closable={true}
      open={open}
      onCancel={close}
      footer={null}
      maskClosable={false}
      className="custom-modal"
      loading={details.loading}
      //   width={"min(90vw, 900px)"}
      width={"fit-content"}
      styles={{ content: { maxWidth: "90vw" } }}
      column={{ xs: 1, sm: 2, md: 3 }}
    >
      {content}
      <div>
        <Descriptions title={`Details`} bordered className="custom-desc">
          <DescriptionsItem label="Name">
            {details?.data?.receipient_name}
          </DescriptionsItem>
          <DescriptionsItem label="Email">
            {details?.data?.email}
          </DescriptionsItem>
          <DescriptionsItem label="Phone">
            {details?.data?.phoneNumber}
          </DescriptionsItem>
          <DescriptionsItem label="Proposal Type">
            {details?.data?.proposal_name}
          </DescriptionsItem>
          <DescriptionsItem label="Status">
            {details?.data?.status === 0 ? (
              <Tag className="tag-pending">PENDING</Tag>
            ) : (
              <Tag className="tag-submitted">SUBMITTED</Tag>
            )}
          </DescriptionsItem>
          <DescriptionsItem label="Created by">
            {details?.data?.created_by}
          </DescriptionsItem>
          <DescriptionsItem label="Date Created">
            {dayjs(details?.data?.date_created).format("DD MMM, YY hh:mm A")}
          </DescriptionsItem>
          <DescriptionsItem label="Date Submitted">
            {dayjs(details?.data?.form_submitted).format("DD MMM, YY hh:mm A")}
          </DescriptionsItem>
        </Descriptions>
      </div>
    </Modal>
  );
}
