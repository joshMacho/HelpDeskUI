import { LoadingOutlined } from "@ant-design/icons";
import { Dropdown, message, Popconfirm, Spin, Table } from "antd";
import {
  CloseSquare,
  Edit,
  HamburgerMenu,
  Refresh,
  TransmitSqaure2,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { deleteUserAsync, setUsers } from "../../redux/userSlice";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";
import UserDrawer from "../drawers/UserDrawer";
import MigrateViewModal from "../modal/MigrateViewModal";

export default function UserTable() {
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
  ];

  // user data
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // useStates
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [messageApi, content] = message.useMessage();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [userData, setUserData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [renderOpen, setRenderOpen] = useState(false);
  const [migrateWindow, setMigrateWindow] = useState(false);
  const [migrateData, setMigrateData] = useState({});
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(search);
    }, 500);
    return () => clearTimeout(timer);
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  //
  const filteredData = (
    Array.isArray(users.data) && users.data.length > 0 ? users.data : []
  ).filter((user) => {
    if (!debounce) return true;
    const q = debounce.trim().toLowerCase();
    return user.fullName?.toLowerCase().includes(q);
  });

  // data source
  const dataSource = filteredData.map((user) => ({
    key: user.user_id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    location: user.location,
    department: user.department,
  }));

  // get all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/getusers");
      if (!response.data.success)
        return messageApi.error(
          response.data?.error || `Error loading users. Contact admin`,
        );
      dispatch(setUsers(response.data.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return toast.error(
        error.response.data?.error ||
          `Error loading users, check connection / contact admin`,
      );
    }
  };

  // update user
  const updateOption = async () => {
    // update logic
    if (selectedRowKeys.length === 0 || selectedRowKeys.length > 1) {
      setRenderOpen(false);
      return messageApi.warning(`Make a single(1) selection for this action`);
    }
    setLoader(true);
    setOpenUpdate(true);
    try {
      const response = await api.get(`/getuser/${selectedRowKeys[0]}`);
      if (!response.data.success)
        return toast.error(response.data?.error || `Unable to fetch user data`);
      setUserData(response.data.data);
      setLoader(false);
      setRenderOpen(false);
    } catch (error) {
      console.log(`error form fetching update user, `, error);
      setLoader(false);
      return toast.error(
        error?.response.data?.error || `Error contacting server for user data`,
      );
    } finally {
      setRenderOpen(false);
    }
  };

  // delete users
  const yesDelete = async () => {
    if (selectedRowKeys.length === 0)
      return messageApi.warning("No user selected");
    try {
      const response = await dispatch(
        deleteUserAsync(selectedRowKeys),
      ).unwrap();
      if (!response.success)
        return messageApi.error(response?.error || `Error deleting user(s)`);
      toast.success(response?.message || `User(s) deleted successfully`);
      setRenderOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.error ||
          `Error deleting user(s). Check connection / contact admin`,
      );
    } finally {
      setRenderOpen(false);
    }
  };

  // cancel delete
  const cancelDelete = () => {
    setRenderOpen(false);
    setSelectedRowKeys([]);
  };

  // check migration
  const migrateUser = async () => {
    if (selectedRowKeys.length === 0 || selectedRowKeys.length > 1)
      return messageApi.warning(`Select a single (1) user to perform action`);
    try {
      const response = await api.get(`/migraterequest/${selectedRowKeys[0]}`);
      if (!response.data.success)
        return messageApi.warn(response.data?.error || `User migrated already`);
      setRenderOpen(false);
      setMigrateData(response.data.data);
      setMigrateWindow(true);
    } catch (error) {
      console.log(`error migrating user: `, error);
      return toast.error(
        error.response.data?.error ||
          `Error migrating user. Check connection / contact admin`,
      );
    }
  };

  // close window
  const closeMigrate = () => {
    setSelectedRowKeys([]);
    setMigrateWindow(false);
  };

  const onSuccess = () => {
    closeMigrate();
  };

  if (loader)
    return <LoadingModal message={`...fetching user`} open={loader} />;

  return (
    <div className="custom-table">
      {content}
      {openUpdate && (
        <UserDrawer
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          isEdit={true}
          info={userData}
          onSuccess={() => {
            setSelectedRowKeys([]);
            setOpenUpdate(false);
          }}
        />
      )}
      {migrateWindow && (
        <MigrateViewModal
          open={migrateWindow}
          onClose={closeMigrate}
          info={migrateData}
          isEdit={false}
          onSuccess={onSuccess}
        />
      )}
      <div className="comp-head-div">
        <p>Users</p>
        <div className="table-actions">
          <div className="search-input-div">
            <input
              type="text"
              id="sch1"
              name="sch1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Name..."
            />
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchUsers()}
            disabled={loading}
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
                  title="Delete Type(s)"
                  description={`Are you want to delete ${selectedRowKeys.length} type(s)`}
                  onConfirm={yesDelete}
                  onCancel={cancelDelete}
                  okButtonProps={{
                    loading: users.loading,
                    disabled: users.loading,
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <button>
                    <CloseSquare className="popIcon" variant="Broken" />
                    Delete
                  </button>
                </Popconfirm>
                <button onClick={updateOption}>
                  <Edit className="popIcon" variant="Broken" />
                  Update
                </button>
                <button onClick={migrateUser}>
                  <TransmitSqaure2 className="popIcon" variant="Broken" />
                  Migrate
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
          columns={columns}
          className="custom-table"
          rowSelection={Object.assign({ type: "checkbox" }, rowSelection)}
          dataSource={dataSource}
          sticky
          // scroll={{
          //   y: 150,
          // }}
        />
      )}
    </div>
  );
}
