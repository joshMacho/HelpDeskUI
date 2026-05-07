import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import { Add, Key, Minus } from "iconsax-reactjs";
import { useState } from "react";

export default function AssignLicenseModal({ open, onClose, info, success }) {
  const [tableLoading, setTableLoading] = useState(true);
  const [licenseData, setLicenseData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const tableColumns = [
    { title: "SN", dataIndex: "sn" },
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
  };

  const datasource = (
    Array.isArray(licenseData) && licenseData.length > 0 ? licenseData : []
  ).map((info) => ({
    key: info?.device_id,
    sn: info?.sn,
    make: info?.make,
    model: info?.model,
    user_assigned: info?.assigned_user,
  }));

  return (
    <Modal
      header={`License ${info?.license || ""}`}
      closable={true}
      open={open}
      onCancel={onClose}
      footer={null}
      className=""
      width={"auto"}
    >
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
            <button className="act-btn all-border btn-p-s">
              <Add size={20} className="icnax" variant="Broken" />
            </button>
            <button className="act-btn all-border btn-p-s">
              <Minus size={20} className="icnax" variant="Broken" />
            </button>
          </div>
        </div>
        {tableLoading ? (
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
          />
        )}
      </div>
    </Modal>
  );
}
