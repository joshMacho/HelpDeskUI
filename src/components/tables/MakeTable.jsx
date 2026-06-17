import { Dropdown, message, Popconfirm, Popover, Spin, Table } from "antd";
import { CloseSquare, Edit, HamburgerMenu, Refresh } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import Loading from "../ui/Loading";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";
import { deleteMakeAsync, setMake } from "../../redux/deviceMakeSlice";
import MakeDrawer from "../drawers/MakeDrawer";

export default function MakeTable() {
  const deviceMake = useSelector((state) => state.deviceMake);
  const dispatch = useDispatch();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [messageApi, content] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [info, setInfo] = useState({});
  const [fetchingMakeLoad, setFetchingMakeLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [debounce, setDebounced] = useState("");

  const columns = [{ title: "Name", dataIndex: "name" }];

  useEffect(() => {
    fetchTypes();
  }, []);

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
      const response = await api.get("/getdevicemake");
      if (!response.data?.success)
        messageApi.error(response.data?.error || `Unable to load device types`);
      dispatch(setMake(response.data.data));
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
    Array.isArray(deviceMake.data) && deviceMake.data.length > 0
      ? deviceMake.data
      : []
  ).filter((make) => {
    if (!debounce) return true;
    const q = debounce.trim().toLowerCase();

    return make.name?.toLowerCase().includes(q);
  });

  // datasource
  const dataSource = filteredData.map((make) => ({
    key: make.make_id,
    name: make.name,
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
    dispatch(deleteMakeAsync(selectedRowKeys))
      .unwrap()
      .then((deleted) => {
        if (!deleted.success) {
          toast.warn(
            deleted?.error || `Unable to delete ${deleted.failed.join(", ")}`,
          );
        } else {
          console.log(deleted);
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
      return messageApi.warning(`Select a (1) make to update`);
    setFetchingMakeLoad(true);
    // * get info of type
    try {
      const info = await api.get(`/getdevicemake/${selectedRowKeys[0]}`);
      if (info.data.success) {
        setInfo(info.data.data);
        setOpenUpdate(true);
        setFetchingMakeLoad(false);
        setIsEdit(true);
        messageApi.info(`Type found`);
      } else {
        messageApi.error(info.data?.error || `Unable to fetch type`);
        setFetchingMakeLoad(false);
      }
    } catch (error) {
      setFetchingMakeLoad(false);
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

  if (fetchingMakeLoad)
    return (
      <LoadingModal message={`...Fetching type`} open={fetchingMakeLoad} />
    );

  return (
    <div className="typeTable-div">
      {content}
      {openUpdate && (
        <MakeDrawer
          isEdit={isEdit}
          open={openUpdate}
          info={info}
          onClose={closeUpdate}
          onSuccess={onSuccessfulUPdate}
        />
      )}
      <div className="comp-head-div">
        <p>Make</p>
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
                  title="Delete Make(s)"
                  description={`Are you sure you want to delete ${selectedRowKeys.length} Make(s)`}
                  onConfirm={yesDelete}
                  onCancel={cancelDelete}
                  okButtonProps={{
                    loading: deviceMake.loading,
                    disabled: deviceMake.loading,
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
