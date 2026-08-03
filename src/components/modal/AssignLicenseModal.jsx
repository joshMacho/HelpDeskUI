import { LoadingOutlined } from "@ant-design/icons";
import { message, Modal, Spin, Table } from "antd";
import { Add, Key, Minus, Refresh } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api";
import { toast } from "react-toastify";

export default function AssignLicenseModal({ open, onClose, info, success }) {
  const devices = useSelector((state) => state.devices);
  const [tableLoading, setTableLoading] = useState(false);
  const [licenseData, setLicenseData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [existDevices, setExistDevices] = useState([]);
  const [messageApi, content] = message.useMessage();

  const tableColumns = [
    { title: "SN", dataIndex: "sn" },
    {
      title: "TYPE",
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
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: existDevices.includes(record.device_id),
    }),
  };

  const datasource = (
    Array.isArray(devices.data) && devices.data.length > 0 ? devices.data : []
  ).map((info) => ({
    key: info?.device_id,
    device_id: info?.device_id,
    sn: info?.sn,
    make: info?.make,
    model: info?.model,
    type: info?.type,
  }));

  // attach the license to the selected devices
  const attachLicense = async () => {
    if (selectedRowKeys.length === 0)
      return messageApi.error(`Select a device to attach`);
    try {
      const response = await api.post("/auth/attachlicense", {
        license_id: info.license_id,
        license_type: info.license_type,
        devices: selectedRowKeys,
      });
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unabel to attach license to device(s)`,
        );
      // get the non attached again
      await getNonAttached();
      success();
      toast.success(response?.data?.success || `Attach successfull`);
      setSelectedRowKeys([]);
    } catch (error) {
      console.log(`Error from attaching licenses, `, error);
      return messageApi.error(
        error?.response?.data?.error || `Error attaching license to devices`,
      );
    }
  };

  const getNonAttached = async () => {
    try {
      const response = await api.get(`/auth/nonattached/${info.license_type}`);
      setExistDevices(response.data.data);
    } catch (error) {
      console.log(error);
      return messageApi.error(`Error getting NON-A-DATA`);
    }
  };

  useEffect(() => {
    getNonAttached();
  }, [info?.license_type]);

  return (
    <Modal
      header={`License ${info?.license || ""}`}
      closable={true}
      open={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      className=""
      width={"auto"}
    >
      {content}
      <div className="">
        <div className="comp-head-div">
          <p>Devices</p>
          <div className="table-actions">
            <div className="search-input-div">
              <input type="text" id="sch" name="sch" />
            </div>
            <button className="act-btn all-border btn-p-s">
              <Refresh size={20} className="icnax" variant="Broken" />
            </button>
            <button
              className="act-btn all-border btn-p-s"
              onClick={() => attachLicense()}
            >
              <Add size={20} className="icnax" variant="Broken" />
            </button>
          </div>
        </div>
        {devices.loading && tableLoading ? (
          <div className="load-in">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        ) : (
          <Table
            columns={tableColumns}
            className="custom-table"
            rowSelection={Object.assign({ type: "checkbox" }, rowSelection)}
            dataSource={datasource}
            pagination={{ pageSize: 5 }}
            rowClassName={(record) =>
              existDevices.includes(record.device_id) ? "disabled-row" : ""
            }
          />
        )}
      </div>
    </Modal>
  );
}
