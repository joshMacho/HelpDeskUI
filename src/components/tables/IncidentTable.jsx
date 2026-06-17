import { Dropdown, message, Popconfirm, Spin, Table } from "antd";
import {
  CloseSquare,
  Edit,
  Eye,
  FilterAdd,
  ForwardItem,
  HamburgerMenu,
  More,
  Refresh,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";
import api from "../../api";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SetStateModal from "../modal/SetStateModal";

export default function IncidentTable() {
  const [openDropdownId, setOpenDropDownId] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [incidentId, setIncidentId] = useState(null);
  const navigate = useNavigate();

  const viewReport = (id) => {
    navigate(`${id}`);
  };

  const setStateAction = (id) => {
    setIncidentId(id);
    setOpenStatus(true);
  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "incident_id",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Issue Type",
      dataIndex: "issue_type",
    },
    {
      title: "Reported By",
      dataIndex: "request_by",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const isOpen = openDropdownId === record.incident_id;
        return (
          <Dropdown
            open={isOpen}
            placement="bottomLeft"
            trigger={["click"]}
            onOpenChange={(open) => {
              setOpenDropDownId(open ? record.incident_id : null);
            }}
            menu={{
              items: [
                {
                  key: "view",
                  label: (
                    <div
                      className="flex items-center gap-2"
                      onClick={() => viewReport(record.incident_id)}
                    >
                      <Eye className="icnax" size={16} variant="Broken" />
                      <span>View</span>
                    </div>
                  ),
                },
                {
                  key: "state",
                  label: (
                    <div
                      className="flex items-center gap-2"
                      onClick={() => setStateAction(record.incident_id)}
                    >
                      <ForwardItem
                        className="icnax"
                        size={16}
                        variant="Broken"
                      />
                      <span>Set State</span>
                    </div>
                  ),
                },
              ],
            }}
          >
            <button className="act-btn all-border btn-p-s" type="button">
              <More className="icnax" variant="Broken" size={20} />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  const [messageApi, content] = message.useMessage();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [renderOpen, setRenderOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [debounce, setDebounce] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(search);
    }, 500);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    fetchTable();
  }, []);

  const yesDelete = () => {};

  const cancelDelete = () => {};

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const filteredData = (
    Array.isArray(data) && data.length > 0 ? data : []
  ).filter((incident) => {
    if (!debounce) return true;
    const q = debounce.trim().toLowerCase();

    return (
      incident.incident_id?.toLowerCase().includes(q) ||
      incident.reported_user?.toLowerCase().includes(q) ||
      incident.title?.toLowerCase().includes(q)
    );
  });

  const dataSource = filteredData.map((incident) => ({
    key: incident?.id || "",
    status: incident?.status || "",
    incident_id: incident?.id || "",
    title: incident?.title || "",
    request_by: incident?.reported_user || "",
    issue_type: incident?.type || "",
    description: incident?.description || "",
  }));

  // get data
  const fetchTable = async () => {
    try {
      setLoading(true);
      const response = await api.get("/getincidents");
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch incidents`,
        );
      setData(response?.data?.data || []);
    } catch (error) {
      console.log(`Error from fetching incidents: `, error);
      return toast.error(
        error?.response?.data?.error ||
          `Unable to fetch incidents. Contact Admin / Check connection`,
      );
    } finally {
      setLoading(false);
    }
  };

  // successfully set the state
  const onSuccess = async (message) => {
    setOpenStatus(false);
    await fetchTable();
    messageApi.success(message || `State set successfully`);
  };

  return (
    <div className="">
      {content}
      {openStatus && (
        <SetStateModal
          incident_id={incidentId}
          open={openStatus}
          cancel={() => setOpenStatus(false)}
          success={onSuccess}
        />
      )}

      <div className="comp-head-div">
        <div className="tab-m">
          <Dropdown
            open={renderOpen}
            placement="bottomRight"
            trigger={["click"]}
            onOpenChange={setRenderOpen}
            popupRender={() => (
              <div className="pop-render">
                <Popconfirm
                  title="Delete Issue"
                  description="Are you sure you want to delete?"
                  onConfirm={yesDelete}
                  onCancel={cancelDelete}
                  okButtonProps={{ loading: loading }}
                  okText="Delete"
                  cancelText="cancel"
                >
                  <button>
                    <CloseSquare className="popIcon" variant="Broken" />
                    Delete
                  </button>
                </Popconfirm>
                <button>
                  <Edit className="popIcon" variant="Broken" />
                  Update
                </button>
              </div>
            )}
          >
            <button className="act-btn all-border btn-p-s">
              <HamburgerMenu variant="Broken" className="icnax" size={20} />
            </button>
          </Dropdown>
          <p>Issues</p>
        </div>
        <div className="table-actions">
          <div className="search-input-div">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchTable()}
          >
            <Refresh size={20} className="icnax" variant="Broken" />
          </button>
        </div>
      </div>
      {loading ? (
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
