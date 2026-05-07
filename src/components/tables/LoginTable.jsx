import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import {
  Dropdown,
  message,
  Popconfirm,
  Segmented,
  Spin,
  Table,
  Tag,
} from "antd";
import { setAccounts, setFilter } from "../../redux/accountSlice";
import { HamburgerMenu, Refresh, Verify } from "iconsax-reactjs";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function LoginTable() {
  const columns = [
    { title: "User_Id", dataIndex: "user_id" },
    { title: "Name", dataIndex: "name" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => {
        const color = value === 1 ? "green" : "red";
        const name = value === 1 ? "Active" : "Disabled";
        return <Tag color={color}>{name}</Tag>;
      },
    },
  ];

  // from redux
  const accounts = useSelector((state) => state.accounts);
  const dispatch = useDispatch();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, content] = message.useMessage();
  const [renderOpen, setRenderOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const filter = ["DEACTIVATED", "ACTIVE", "ALL"];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedAccounts(selected);
    },
  };

  const dataSource = (
    Array.isArray(accounts.data) && accounts.data.length > 0
      ? accounts.data
      : []
  ).map((account) => ({
    key: account.user_id,
    user_id: account.user_id,
    name: account.fullName,
    role: account.role,
    status: account.status,
  }));

  // get all account holders
  const fetchAccounts = async (value) => {
    setLoading(true);
    try {
      const response = await api.post("/getaccounts", { type: value });
      if (!response.data.success)
        return messageApi(
          response.data?.error || `Unable to fetch account holders.`,
        );
      dispatch(setAccounts(response.data.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return toast.error(
        error.response.data.error ||
          `Error fetching account holders. Check connection / contact admin.`,
      );
    }
  };

  const clickSegment = async (value) => {
    const index = filter.indexOf(value);
    dispatch(setFilter(index));
    console.log(accounts.filterIndex);
    await fetchAccounts(index);
  };

  // unselect all
  const unselectTable = () => {
    setSelectedAccounts([]);
    setSelectedRowKeys([]);
  };

  const yesAction = async (value) => {
    const action = !value;
    //console.log(action);
    try {
      const response = await api.post("useraction", {
        ids: selectedRowKeys,
        type: action,
      });
      if (!response.data.success) {
        setRenderOpen(false);
        return messageApi.error(
          response.data?.error || `Error performing action on user(s)`,
        );
      }
      setRenderOpen(false);
      unselectTable();
      return toast.success(
        response.data?.message ||
          `Successfully ${value ? "Activated" : "Deactivated"} user(s)`,
      );
    } catch (error) {
      console.log(error);
      setRenderOpen(false);
      unselectTable();
      return toast.error(
        error.response?.data?.error ||
          `Error performing action. Check connection / contact admin`,
      );
    }
  };

  const cancelAction = () => {};

  return (
    <div className="custom-table">
      {content}
      <div className="ac-upndown">
        <div className="comp-head-div">
          <p>Accounts</p>
          <div className="table-actions">
            <div className="search-input-div">
              <input type="text" />
            </div>
            <button
              className="act-btn all-border btn-p-s"
              disabled={loading}
              onClick={() => fetchAccounts(accounts.filterIndex)}
            >
              <Refresh variant="Broken" className="icnax" size={20} />
            </button>
            <Dropdown
              open={renderOpen}
              placement="left"
              trigger={["click"]}
              onOpenChange={setRenderOpen}
              popupRender={() => (
                <div className="pop-render">
                  <Popconfirm
                    title={`${
                      selectedAccounts[0]?.status === 1
                        ? "Deactivate user"
                        : "Activate user"
                    }`}
                    description={`Are you sure you want to ${
                      selectedAccounts[0]?.status === 1
                        ? "Deactivate"
                        : "Activate"
                    } user?`}
                    onConfirm={() => yesAction(selectedAccounts[0].status)}
                    onCancel={cancelAction}
                    okButtonProps={{
                      loading: actionLoading,
                      disabled: actionLoading,
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button>
                      <Verify className="popIcon" variant="Broken" />
                      {selectedAccounts[0]?.status === 1
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </Popconfirm>
                </div>
              )}
            >
              <button className="act-btn all-border btn-p-s">
                <HamburgerMenu variant="Broken" className="icnax" size={20} />
              </button>
            </Dropdown>
          </div>
        </div>
        <div className="seg-div">
          <Segmented
            options={filter}
            onChange={(value) => {
              clickSegment(value);
            }}
            className="custom-segmented"
            value={filter[accounts.filterIndex]}
          />
        </div>
      </div>
      {loading ? (
        <div className="load-in">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <Table
          columns={columns}
          className="custom-table"
          rowSelection={Object.assign({ type: "checkbox " }, rowSelection)}
          dataSource={dataSource}
        />
      )}
    </div>
  );
}
