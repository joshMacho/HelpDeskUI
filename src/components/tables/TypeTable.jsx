import { Dropdown, message, Popconfirm, Popover, Spin, Table } from "antd";
import { CloseSquare, Edit, HamburgerMenu, Refresh } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { deleteTypeAsync, setTypes } from "../../redux/addTypeSlice";
import Loading from "../ui/Loading";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import TypeDrawer from "../drawers/TypeDrawer";
import LoadingModal from "../LoadingModal";

export default function TypeTable() {
  const deviceTypes = useSelector((state) => state.deviceTypes);
  const dispatch = useDispatch();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [messageApi, content] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [info, setInfo] = useState({});
  const [fetchingTypeLoad, setFetchingTypeLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [debounce, setDebounced] = useState("");

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
  ];

  useEffect(() => {
    fetchTypes();
  }, []);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // function to fetch data
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/getdevicetypes");
      if (!response.data?.success)
        messageApi.error(response.data?.error || `Unable to load device types`);
      dispatch(setTypes(response.data.data));
      setLoading(false);
    } catch (error) {
      messageApi.error(
        error.response?.data?.error ||
          `Unable to contact server (Device Types)`,
      );
      console.log(`Device type error: `, error);
    } finally {
      setLoading(false);
    }
  };

  // filtered data
  const filteredData = (
    Array.isArray(deviceTypes.data) && deviceTypes.data.length > 0
      ? deviceTypes.data
      : []
  ).filter((type) => {
    if (!debounce) return true;
    const q = debounce.trim().toLowerCase();
    if (!q) return true;

    return type.name?.toLowerCase().includes(q);
  });

  // datasource
  const dataSource = (
    Array.isArray(filteredData) && filteredData.length > 0 ? filteredData : []
  ).map((type) => ({
    key: type.type_id,
    name: type.name,
    description: type.description,
  }));

  // row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedRows(selected);
    },
  };

  // yes delete
  const yesDelete = () => {
    dispatch(deleteTypeAsync(selectedRowKeys))
      .unwrap()
      .then((deleted) => {
        if (!deleted.success) {
          toast.warn(
            deleted?.error || `Unable to delete ${deleted.failed.join(", ")}`,
          );
        } else {
          toast.success(deleted.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.error);
      });
  };

  // cancel delete
  const cancelDelete = () => {
    clealAllSelection();
  };

  // update selection
  const updateOption = async () => {
    if (selectedRowKeys.length < 1 || selectedRowKeys.length > 1)
      return messageApi.warning(`Select a (1) type to update`);
    setFetchingTypeLoad(true);
    // * get info of type
    try {
      const info = await api.get(`/getdevicetype/${selectedRowKeys[0]}`);
      if (info.data.success) {
        setInfo(info.data.data);
        setOpenUpdate(true);
        setFetchingTypeLoad(false);
        setIsEdit(true);
        messageApi.info(`Type found`);
      } else {
        messageApi.error(info.data?.error || `Unable to fetch type`);
        setFetchingTypeLoad(false);
      }
    } catch (error) {
      setFetchingTypeLoad(false);
      return toast.error(
        error.response?.data?.error || `Error getting type. contact admin`,
      );
    }
  };

  // *********** close update *************
  const closeUpdate = () => {
    setIsEdit(false);
    setOpenUpdate(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  // ********** on successful update *************
  const onSuccessfulUPdate = () => {
    closeUpdate();
  };

  // clear selection
  const clealAllSelection = () => {
    setSelectedRowKeys([]);
  };

  if (fetchingTypeLoad)
    return (
      <LoadingModal message={`...Fetching type`} open={fetchingTypeLoad} />
    );

  return (
    <div className="typeTable-div">
      {content}
      {openUpdate && (
        <TypeDrawer
          isEdit={isEdit}
          open={openUpdate}
          info={info}
          onClose={closeUpdate}
          onSuccess={onSuccessfulUPdate}
        />
      )}
      <div className="comp-head-div">
        <p>Type</p>
        <div className="table-actions">
          <div className="search-input-div">
            <input
              type="text"
              id="sch"
              name="sch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchTypes()}
            disabled={loading}
          >
            <Refresh variant="Broken" className="icnax" size={20} />
          </button>
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            popupRender={() => (
              <div className="pop-render">
                <Popconfirm
                  title="Delete Type(s)"
                  description={`Are you want to delete ${selectedRowKeys.length} type(s)`}
                  onConfirm={yesDelete}
                  onCancel={cancelDelete}
                  okButtonProps={{
                    loading: deviceTypes.loading,
                    disabled: deviceTypes.loading,
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
          pagination={{ pageSize: 3 }}
          // scroll={{
          //   y: 150,
          // }}
        />
      )}
    </div>
  );
}
