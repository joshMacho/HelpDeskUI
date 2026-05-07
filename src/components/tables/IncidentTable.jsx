import { Dropdown, message, Popconfirm, Spin, Table } from "antd";
import {
  CloseSquare,
  Edit,
  FilterAdd,
  HamburgerMenu,
  Refresh,
} from "iconsax-reactjs";
import { use, useEffect, useState } from "react";

export default function IncidentTable() {
  const tableColumns = [
    {
      title: "Incident ID",
      dataIndex: "incident_id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Request By",
      dataIndex: "request_by",
    },
    {
      title: "Request For",
      dataIndex: "request_for",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
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

  const fetchTable = () => {};

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
      incident.requester?.toLowerCase().includes(q) ||
      incident.title?.toLowerCase().includes(q)
    );
  });

  const dataSource = filteredData.map((incident) => ({
    key: incident?.incident_id || "",
    incident_id: incident?.incident_id || "",
    title: incident?.title || "",
    request_by: incident?.request_by || "",
    request_for: incident?.request_for || "",
    description: incident?.description || "",
    status: incident?.status || "",
  }));

  return (
    <div className="">
      {content}
      <div className="comp-head-div">
        <p>Issues</p>
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
