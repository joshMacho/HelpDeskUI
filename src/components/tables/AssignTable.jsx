import { LoadingOutlined } from "@ant-design/icons";
import { Dropdown, message, Spin, Table } from "antd";
import { HamburgerMenu, Level, Refresh } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { setAssignedDevice } from "../../redux/assignDeviceSlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import AssignDeviceModal from "../modal/AssignDeviceModal";

export default function AssignTable() {
  const [messageApi, content] = message.useMessage();
  const assignDevice = useSelector((state) => state.assignDevice);
  const dispatch = useDispatch();

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
    {
      title: "Model",
      dataIndex: "model",
    },
    {
      title: "Current User",
      dataIndex: "curr_assigned",
    },
    {
      title: "Assigned Date",
      dataIndex: "date_assigned",
    },
  ];
  const [renderOpen, setRenderOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDev, setSelectedDev] = useState({});
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState("");

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelected(selected);
    },
  };

  const filteredData = (
    Array.isArray(assignDevice.data) && assignDevice.data.length > 0
      ? assignDevice.data
      : []
  ).filter((device) => {
    if (!debounce) return true;
    const q = debounce.trim().toLowerCase();
    return (
      device.sn?.toLowerCase().includes(q) ||
      device.make?.toLowerCase().includes(q) ||
      device.model?.toLowerCase().includes(q) ||
      device.curr_assigned?.toLowerCase().includes(q)
    );
  });

  const dataSource = filteredData.map((device) => ({
    key: device.device_id,
    sn: device.sn,
    type: device.type,
    make: device.make,
    model: device.model,
    curr_assigned: device.curr_assigned,
    date_assigned: device.date_assigned
      ? dayjs(device.date_assigned).format("D MMMM, YYYY")
      : null,
  }));

  const fetchDeviceUser = async () => {
    try {
      const response = await api.get("/deviceuser");
      if (!response.data.success)
        return messageApi.error(
          response.data?.error || `Unable to load assigned user data`,
        );
      dispatch(setAssignedDevice(response.data.data));
    } catch (error) {
      console.log(error);
      return toast.error(
        error.response?.data?.error ||
          `Error loading device assigned list. Check connection / contact admin`,
      );
    }
  };

  // open the assign modal
  const openAssignModal = () => {
    if (selectedRowKeys.length > 1)
      return messageApi.warning("Can only assign one (1) device per person");
    setSelectedDev({ key: selected[0].key });
    setOpenModal(true);
    setRenderOpen(false);
  };

  // onSuccess
  const onSuccess = () => {
    setOpenModal(false);
    setSelected([]);
    setSelectedRowKeys([]);
  };

  return (
    <div className="assign-table-div">
      {content}
      {openModal && (
        <AssignDeviceModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          info={selectedDev}
          onSuccess={onSuccess}
        />
      )}
      <div className="comp-head-div">
        <p>Devices</p>
        <div className="table-actions">
          <div className="search-input-div">
            <input
              type="text"
              name="sch"
              id="sch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchDeviceUser()}
          >
            <Refresh size={20} className="icnax" variant="Broken" />
          </button>
          <Dropdown
            open={renderOpen}
            placement="bottomLeft"
            trigger={["click"]}
            onOpenChange={setRenderOpen}
            popupRender={() => (
              <div className="pop-render">
                <button onClick={() => openAssignModal()}>
                  <Level className="popIcon" variant="Broken" />
                  Assign
                </button>
              </div>
            )}
          >
            <button className="act-btn all-border btn-p-s">
              <HamburgerMenu variant="broken" className="icnax" size={20} />
            </button>
          </Dropdown>
        </div>
      </div>
      {tableLoading ? (
        <div className="load-in">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          />{" "}
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
