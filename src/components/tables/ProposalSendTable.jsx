import { Dropdown, message, Spin, Table, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import {
  Book,
  Copy,
  DocumentText1,
  Link1,
  More,
  Refresh,
} from "iconsax-reactjs";
import { CopyOutlined, LoadingOutlined } from "@ant-design/icons";
import motorSchema from "../../data/motor.json";
import { set } from "react-hook-form";
import LoadingModal from "../LoadingModal";
import ViewFormModal from "../modal/ViewFormModal";

export default function ProposalSendTable() {
  const { Text } = Typography;

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const viewSubmitted = async (proposal_id) => {
    const previewUrl = `${import.meta.env.VITE_API_BASE_URL}/document/${proposal_id}/preview`;
    console.log(previewUrl);
    window.open(previewUrl, "_blank");
  };

  const viewForm = async (proposal_id) => {
    // open tab immediately to avoid popup blockers, then navigate to the form URL after fetching it
    const newTab = window.open("", "_blank");

    try {
      const response = await api.post(
        `/viewdocument/${proposal_id}`,
        {},
        {
          responseType: "blob",
        },
      );
      // if (!response.data.success)
      //   return messageApi.error(
      //     response?.data?.error || `Unable to fetch proposal form.`,
      //   );
      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);

      // safari safe
      if (newTab) {
        newTab.location.href = pdfUrl;
      } else {
        // fallback if tab couldn't be opened (e.g. popup blocker)
        window.location.href = pdfUrl;
      }
      toast.success(`Proposal form opened`);
    } catch (error) {
      console.log(`error from proposal view: `, error);

      // close blank tab if request failed
      if (newTab) newTab.close();

      if (error?.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          return toast.error(json?.error);
        } catch {
          return toast.error("Failed to preview document");
        }
      }
      return toast.error(
        error?.response?.data?.error ||
          `Error fetching proposal form. Contact admin / check connection`,
      );
    }
  };

  // view form details in modal
  const viewDetails = async (proposal_id) => {
    try {
      const response = await api.get(`/viewdocument/${proposal_id}`);
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch proposal details.`,
        );
      setModalData(response.data.data);
      setDetailsModalOpen(true);
      setLoadingModal(false);
    } catch (error) {
      console.log(`error from proposal details fetch: `, error);

      return toast.error(
        error?.response?.data?.error ||
          `Error fetching proposal details. Contact admin / check connection`,
      );
    } finally {
      setLoadingModal(false);
    }
  };

  const tableColumns = [
    { title: "ID", dataIndex: "pt_ID" },
    { title: "Customer Name", dataIndex: "receipient_name" },
    {
      title: "Link",
      dataIndex: "proposal_link",
      ellipsis: true,
      onCell: () => ({ style: { minWidth: 200 } }),
      render: (text) => (
        <div className="tablink-div">
          <Tooltip title={text}>
            <Text style={{ maxWidth: 150 }} ellipsis={{ tooltip: false }}>
              <a
                href={text}
                target="_blank"
                rel="noopener noreferrer"
                style={{ maxWidth: 150, display: "inline-block" }}
              >
                {text}
              </a>
            </Text>
          </Tooltip>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => {
              navigator.clipboard.writeText(text);
              messageApi.success(`Link copied`);
            }}
          >
            <Copy className="icnax" size={20} variant="Broken" />
          </button>
        </div>
      ),
    },
    // { title: "Email", dataIndex: "email" },
    // { title: "Phone", dataIndex: "phoneNumber" },
    {
      title: "Type",
      dataIndex: "proposal_name",
    },
    // { title: "Created By", dataIndex: "created_by" },
    { title: "Date", dataIndex: "date_created" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => {
        const color = value === 0 ? "yellow" : "green";
        const name = value === 0 ? "PENDING" : "SUBMITTED";
        return <Tag color={color}>{name}</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 80,

      render: (_, record) => {
        const isOpen = openDropdownId === record.pt_ID;

        return (
          <Dropdown
            open={isOpen}
            placement="bottomLeft"
            trigger={["click"]}
            onOpenChange={(open) => {
              setOpenDropdownId(open ? record.pt_ID : null);
            }}
            menu={{
              items: [
                {
                  key: "view-form",
                  label: (
                    <div
                      className="flex items-center gap-2"
                      onClick={() => {
                        viewForm(record.pt_ID);
                        setOpenDropdownId(null);
                      }}
                    >
                      <DocumentText1
                        className="icnax"
                        variant="Broken"
                        size={16}
                      />
                      <span>Preview Form</span>
                    </div>
                  ),
                },
                {
                  key: "view-details",
                  label: (
                    <div
                      className="flex items-center gap-2"
                      onClick={() => viewDetails(record.pt_ID)}
                    >
                      <Book className="incax" variant="Broken" size={16} />
                      View Proposal
                    </div>
                  ),
                },
                {
                  key: "submitted-document",
                  label: (
                    <div
                      className="flex items-center gap-2"
                      onClick={() => viewSubmitted(record.pt_ID)}
                    >
                      <Link1 className="icnax" variant="Broken" size={16} />
                      Submitted Document
                    </div>
                  ),
                },
              ],
            }}
          >
            <button type="button" className="act-btn all-border btn-p-s">
              <More className="icnax" variant="Broken" size={20} />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formData, setFormData] = useState([]);
  const [messageApi, context] = message.useMessage();
  const [tableLoading, setTableLoading] = useState(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const dataSource = (
    Array.isArray(formData) && formData.length > 0 ? formData : []
  ).map((proposal) => ({
    key: proposal.pl_ID,
    pt_ID: proposal.pl_ID,
    receipient_name: proposal.receipient_name,
    email: proposal?.email,
    phoneNumber: proposal?.phoneNumber,
    proposal_name: proposal?.proposal_name,
    proposal_link: proposal.proposal_link,
    created_by: proposal.created_by,
    date_created: dayjs(proposal.date_created).format("DD MMMM, YYYY"),
    status: proposal.status,
  }));

  const fetchProposals = async () => {
    try {
      setTableLoading(true);
      const response = await api.get("/getproposals");
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch proposals.`,
        );
      setFormData(response.data.data);
    } catch (error) {
      console.log(`error from proposal fetch: `, error);
      return toast.error(
        error?.response?.data?.error ||
          `Error fetching proposals. Contact admin / check connection`,
      );
    } finally {
      setTableLoading(false);
    }
  };

  if (loadingModal)
    return <LoadingModal message="Loading proposal details..." />;

  return (
    <div className="atdtable">
      {context}
      {detailsModalOpen && (
        <ViewFormModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          schema={motorSchema}
          data={modalData}
        />
      )}
      <div className="comp-head-div">
        <p>Proposals</p>
        <div className="table-actions">
          <div className="search-input-div">
            <input type="text" id="sch" name="sch" />
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchProposals()}
          >
            <Refresh size={20} className="icnax" variant="Broken" />
          </button>
        </div>
      </div>
      {tableLoading ? (
        <div className="load-in">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <Table
          columns={tableColumns}
          className="custom-table"
          rowSelection={Object.assign({ type: "checkbox" }, rowSelection)}
          dataSource={dataSource}
        />
      )}
    </div>
  );
}
