import { LoadingOutlined } from "@ant-design/icons";
import { Dropdown, message, Popconfirm, Spin, Table } from "antd";
import {
  CloseSquare,
  Edit,
  HamburgerMenu,
  More,
  Refresh,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { toast } from "react-toastify";
import { deleteDeviceAsync, setDevices } from "../../redux/deviceSlice";
import DeviceViewModal from "../modal/DeviceViewModal";
import DeviceDrawer from "../drawers/DeviceDrawer";

export default function DevicesTable() {
  const devices = useSelector((state) => state.devices);
  const dispatch = useDispatch();

  // use states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [itemDetails, setItemDetails] = useState({});
  const [renderOpen, setRenderOpen] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const [openDeviceDrawer, setOpenDeviceDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [debounce, setDebounced] = useState("");

  //message API
  const [messageApi, content] = message.useMessage();

  const tableColumns = [
    {
      title: "SN",
      dataIndex: "sn",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Make",
      dataIndex: "make",
    },
    { title: "Model", dataIndex: "model" },
    { title: "Created by", dataIndex: "created_by" },
  ];

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch data for device table
  const fetchTableData = async () => {
    setTableLoading(true);
    try {
      const response = await api.get("/getdevicetable");
      if (!response.data.success)
        return toast.error(
          response.data?.error || `Unable to load devices. Contact admin`,
        );
      dispatch(setDevices(response.data.data));
      setTableLoading(false);
    } catch (error) {
      messageApi.error(error.response?.data?.error || `Error fetching devices`);
      console.log(error);
      setTableLoading(false);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // filtered data
  const filterdData = (
    Array.isArray(devices.data) && devices.data.length > 0 ? devices.data : []
  ).filter((device) => {
    if (!debounce) return true;
    const q = debounce.trim().toLowerCase();

    return (
      device.sn?.toLowerCase().includes(q) ||
      device.make?.toLowerCase().includes(q) ||
      device.model?.toLowerCase().includes(q)
    );
  });

  const datasource = filterdData.map((device) => ({
    key: device.device_id,
    sn: device.sn,
    make: device.make,
    type: device.type,
    model: device.model,
    created_by: device.created_by,
  }));

  const yesDelete = () => {
    // yes delete
    if (selectedRowKeys.length === 0) {
      return messageApi.warning(`Select device(s) to perform delete action.`);
      setRenderOpen(false);
    }
    dispatch(deleteDeviceAsync(selectedRowKeys))
      .unwrap()
      .then((response) => {
        if (!response.success) {
          setRenderOpen(false);
          return toast.error(response?.error || `Error deleting device(s)`);
        }
        toast.success(
          response?.message ||
            `Successfully deleted ${selectedRowKeys.length} device(s)`,
        );
        setRenderOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setRenderOpen(false);
        messageApi.error(error.response?.data?.error || error.error);
      });
  };

  const cancelDelete = () => {
    // cancel delete
  };

  // open more details modal *****************
  const openViewDetails = async () => {
    if (selectedRowKeys.length > 1 || selectedRowKeys.length === 0)
      return messageApi.warning(`Make a (1) single selection to view detials`);
    const id = selectedRowKeys[0];
    try {
      const response = await api.get(`/getdevicedetails/${id}`);
      if (!response.data.success)
        return messageApi.error(
          `Unable to fetch details of device with id: \`${selectedRowKeys[0]}\``,
        );
      setItemDetails(response.data.data);
      setOpenView(true);
      setRenderOpen(false);
    } catch (error) {
      toast.error(
        error.response.data.error || `Error contacting server. Contact admin.`,
      );
      console.log(error);
    }
  };

  const updateDevice = async () => {
    if (selectedRowKeys.length > 1 || selectedRowKeys.length === 0)
      return messageApi.warning(`Make a (1) single selection to edit detials`);
    try {
      const response = await api.get(
        `/fetchdevicedetails/${selectedRowKeys[0]}`,
      );
      if (!response.data.success)
        return messageApi.error(
          response.data.error || `Error fetching details. Contact Admin`,
        );
      setEditInfo(response.data.data);
      setOpenDeviceDrawer(true);
      setRenderOpen(false);
    } catch (error) {
      console.log(error);
      return toast.error(
        error.response.data?.error || `Error contacting server. Contact Admin`,
      );
    }
  };

  // on success
  const onSuccess = () => {
    setSelectedRowKeys([]);
    setOpenDeviceDrawer(false);
  };

  // onclose of drawer
  const closeDrawer = () => {
    setOpenDeviceDrawer(false);
    setSelectedRowKeys([]);
  };

  return (
    <div className="">
      {content}
      {openView && (
        <DeviceViewModal
          info={itemDetails}
          open={openView}
          onClose={() => setOpenView(false)}
        />
      )}
      {openDeviceDrawer && (
        <DeviceDrawer
          isEdit={true}
          info={editInfo}
          open={openDeviceDrawer}
          onClose={closeDrawer}
          onSuccess={onSuccess}
        />
      )}
      <div className="comp-head-div">
        <p>Devices</p>
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
            onClick={() => fetchTableData()}
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
                  title="Delete device(s)"
                  description={`Are you sure you want to delete ${selectedRowKeys.length} device(s)?`}
                  onConfirm={yesDelete}
                  onCancel={cancelDelete}
                  okButtonProps={{
                    loading: devices.loading,
                    disabled: devices.loading,
                  }}
                  okText="Delete"
                  cancelText="No"
                >
                  <button>
                    <CloseSquare className="popIcon" variant="Broken" />
                    Delete
                  </button>
                </Popconfirm>
                <button onClick={updateDevice}>
                  <Edit className="popIcon" variant="Broken" />
                  Update
                </button>
                <button onClick={openViewDetails}>
                  <More className="popIcon" variant="Broken" />
                  More Details
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
      {tableLoading ? (
        <div className="load-in">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <Table
          columns={tableColumns}
          className="custom-table"
          rowSelection={Object.assign({ type: "checkbox" }, rowSelection)}
          dataSource={datasource}
        />
      )}
    </div>
  );
}
