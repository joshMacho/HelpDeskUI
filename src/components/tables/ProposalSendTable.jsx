import { Dropdown, message, Spin, Table, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { Copy, DocumentText1, More, Refresh } from "iconsax-reactjs";
import { CopyOutlined, LoadingOutlined } from "@ant-design/icons";

export default function ProposalSendTable() {
  const { Text } = Typography;

  const [openDropdownId, setOpenDropdownId] = useState(null);

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
      key: "action",
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
                      <span>View Form</span>
                    </div>
                  ),
                },
              ],
            }}
          >
            <span>
              <button type="button" className="act-btn all-border btn-p-s">
                <More className="icnax" variant="Broken" size={20} />
              </button>
            </span>
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

  return (
    <div className="atdtable">
      {context}

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
