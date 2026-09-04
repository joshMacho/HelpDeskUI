import {
  Dropdown,
  message,
  Modal,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import fireSchema from "../../data/fire.json";
import travelSchema from "../../data/travel.json";
import homeSchema from "../../data/homehouse.json";
import { set } from "react-hook-form";
import LoadingModal from "../LoadingModal";
import ViewFormModal from "../modal/ViewFormModal";
import ProposalDetailsModal from "../modal/ProposalDetailsModal";
import { io } from "socket.io-client";

const ProposalSendTable = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    refresh: () => fetchProposals(pagi.current, pagi.pageSize),
  }));

  const { Text } = Typography;

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [pagi, setPagi] = useState({
    current: 1,
    pageSize: 20,
  });
  const [schemaType, setSchemaType] = useState("");
  const [pDetailsModal, setPDetailsModal] = useState({
    open: false,
    proposal_id: "",
    data: {},
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // filter current page data as user types
  const handleSearch = (term) => {
    setSearchTerm(term);

    // clear search — restore normal paginated data
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const localResults = formData.filter((item) =>
      [
        item.receipient_name,
        item.proposal_name,
        item.created_by,
        item.proposal_link,
      ].some((field) => field?.toLowerCase().includes(term.toLowerCase())),
    );

    setSearchResults(localResults);
  };

  // query the backend when user hits enter
  const handleSearchEnter = async (e) => {
    if (e.key !== "Enter") return;
    const term = searchTerm.trim();
    if (!term) return;

    try {
      setIsSearching(true);
      const response = await api.get(
        `/searchproposals?search=${encodeURIComponent(term)}&page=1&pageSize=${pagi.pageSize}`,
      );
      if (!response.data.success) {
        messageApi.error(response?.data?.error || `Search failed`);
        return;
      }
      setSearchResults(response.data.data);
    } catch (error) {
      console.log(`error from search: `, error);
      toast.error(error?.response?.data?.error || `Error searching proposals`);
    } finally {
      setIsSearching(false);
    }
  };

  const viewSubmitted = async (proposal_id) => {
    const previewUrl = `${import.meta.env.VITE_API_BASE_URL}/document/${proposal_id}/preview`;
    console.log(previewUrl);
    window.open(previewUrl, "_blank");
  };

  useEffect(() => {
    fetchProposals(1, 20);
  }, []);

  // socket effect
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL_SOCKET, {
      withCredentials: true,
    });

    socket.on("proposal:submitted", ({ fullName, proposal }) => {
      console.log("New submission received:", fullName);
      fetchProposals(pagi.current, pagi.pageSize);
      messageApi.info(`${fullName} submitted ${proposal} proposal`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
  const viewDetails = async (proposal_id, proposal_name) => {
    setSchemaType(proposal_name);
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
    // { title: "ID", dataIndex: "pt_ID" },
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
    {
      title: "User",
      dataIndex: "created_by",
    },
    // { title: "Created By", dataIndex: "created_by" },
    { title: "Date", dataIndex: "date_created" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => {
        const isPending = value === 0;

        return (
          <Tag className={isPending ? "tag-pending" : "tag-submitted"}>
            {isPending ? "PENDING" : "SUBMITTED"}
          </Tag>
        );
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
            rootClassName="my-dropdown"
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
                      className="flex items-center gap-2 drop-in-div"
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
                      onClick={() =>
                        viewDetails(record.pt_ID, record.proposal_name)
                      }
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

  const activeData = searchTerm.trim() ? searchResults : formData;

  const dataSource = (
    Array.isArray(activeData) && activeData.length > 0 ? activeData : []
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

  const fetchProposals = async (page, pageSize) => {
    try {
      setTableLoading(true);
      const response = await api.get(
        `/getproposals?page=${page}&pageSize=${pageSize}`,
      );
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch proposals.`,
        );
      setFormData(response.data.data);
      setPagi((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: response.data.total,
      }));
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

  const handleRowClick = (record) => {
    setPDetailsModal((prev) => ({
      ...prev,
      open: true,
      proposal_id: record.pt_ID,
    }));
  };

  const displaySchema = (type) => {
    switch (type) {
      case "MOTOR":
        return motorSchema;
      case "FIRE":
        return fireSchema;
      case "HOME-OR-HOUSE":
        return homeSchema;
      case "TRAVEL":
        return travelSchema;
      default: {
        return {};
      }
    }
  };

  const closeDetailsModal = () => {
    setPDetailsModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="">
      {context}
      {detailsModalOpen && (
        <ViewFormModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          schema={displaySchema(schemaType)}
          data={modalData}
        />
      )}
      {pDetailsModal.open && (
        <ProposalDetailsModal
          open={pDetailsModal.open}
          close={() => closeDetailsModal()}
          info={pDetailsModal.proposal_id}
        />
      )}
      <div className="comp-head-div">
        <p>Proposals</p>
        <div className="table-actions">
          <div className="search-input-div">
            <input
              type="text"
              id="sch"
              name="sch"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleSearchEnter}
            />
            {isSearching && <LoadingOutlined className="icnax" />}
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchProposals(pagi.current, pagi.pageSize)}
          >
            <Refresh size={20} className="icnax" variant="Broken" />
          </button>
        </div>
      </div>
      <Table
        columns={tableColumns}
        className="custom-table"
        loading={tableLoading}
        // rowSelection={Object.assign({ type: "checkbox" }, rowSelection)}
        dataSource={dataSource}
        pagination={searchTerm.trim() ? false : pagi}
        onChange={(pagination) => {
          fetchProposals(pagination.current, pagination.pageSize);
        }}
        onRow={(record) => ({
          onDoubleClick: () => handleRowClick(record),
        })}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
});

export default ProposalSendTable;
