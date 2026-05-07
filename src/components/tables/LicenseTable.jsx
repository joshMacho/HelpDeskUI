import { LoadingOutlined } from "@ant-design/icons";
import { Dropdown, message, Popconfirm, Spin, Table } from "antd";
import { CloseSquare, Edit, HamburgerMenu, Refresh } from "iconsax-reactjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { deleteLicenseAsync, setLicense } from "../../redux/licenseSlice";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";
import LicenseFormDrawer from "../drawers/LicenseFormDrawer";

export default function LicenseTable() {
  const [messageApi, content] = message.useMessage();
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [licenseData, setLicenseData] = useState({});
  const [openUpdate, setOpenUpdate] = useState(false);

  const licenses = useSelector((state) => state.license);
  const dispatch = useDispatch();

  const tableColumns = [
    { title: "License Key", dataIndex: "license_key" },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Number",
      dataIndex: "number",
    },
    {
      title: "Used",
      dataIndex: "used",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const dataSource = (
    Array.isArray(licenses.data) && licenses.data.length > 0
      ? licenses.data
      : []
  ).map((license) => ({
    key: license.license_key,
    license_key: license.license_key,
    name: license.name,
    number: license.license_number,
    description: license.description,
    used: license.used,
  }));

  // reload table
  const fetchTable = async () => {
    try {
      const response = await api.get("/auth/getlicenses");
      if (!response.data.success)
        return messageApi.error(
          response.data?.error || `Unable to fetch licenses`,
        );

      dispatch(setLicense(response.data.data));
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          `Error fetching licenses. Check connection / contact admin`,
      );
      console.log(error);
    }
  };

  const yesDelete = async () => {
    // confirm and delete
    if (selectedRowKeys.length === 0)
      return messageApi.warning(`Select a license to delete!`);
    try {
      const response = await dispatch(
        deleteLicenseAsync(selectedRowKeys),
      ).unwrap();
      console.log(response);
      if (!response.success)
        return messageApi.error(
          response?.error || `Unable to delete license(s)`,
        );
      toast.success(response?.message || `License deleted successfully`);
      setDropOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error || `Error deleteing license(s). Check connection / contact admin`,
      );
    } finally {
      setDropOpen(false);
    }
  };

  const cancelDelete = () => {
    // cancel the delete
  };

  // update aciton
  const updateAction = async () => {
    if (selectedRowKeys.length === 0 || selectedRowKeys.length > 1) {
      setDropOpen(false);
      return messageApi.warning(`Make a single(1) selection for this action`);
    }
    try {
      setLoader(true);
      const response = await api.get(`/auth/getlicense/${selectedRowKeys[0]}`);
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch license data`,
        );
      setLicenseData(response.data.data);
      setOpenUpdate(true);
    } catch (error) {
      console.log(`Error from fetching license update: `, error);
      return toast.error(
        error.response?.data?.error ||
          `Error getting license data. Check connection / contact admin`,
      );
    } finally {
      setLoader(false);
      setDropOpen(false);
    }
  };

  const successfullUpdate = () => {
    setOpenUpdate(false);
    setSelectedRowKeys([]);
  };

  if (loader)
    return <LoadingModal message={`...fetching license`} open={loader} />;

  return (
    <div className="">
      {content}
      {openUpdate && (
        <LicenseFormDrawer
          open={openUpdate}
          onClose={setOpenUpdate}
          isEdit={true}
          info={licenseData}
          onSuccess={successfullUpdate}
        />
      )}
      <div className="comp-head-div">
        <p>Licenses</p>
        <div className="table-actions">
          <div className="search-input-div">
            <input type="text" />
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchTable()}
          >
            <Refresh size={20} className="icnax" variant="Broken" />
          </button>
          <Dropdown
            open={dropOpen}
            placement="bottomRight"
            trigger={["click"]}
            onOpenChange={setDropOpen}
            popupRender={() => (
              <div className="pop-render">
                <Popconfirm
                  title="Delete license"
                  description={`Are you sure you want to delete ${selectedRowKeys.length} license(s) ?`}
                  onConfirm={yesDelete}
                  onCancel={cancelDelete}
                  okButtonProps={{
                    loading: licenses.loading,
                  }}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <button>
                    <CloseSquare className="popIcon" variant="Broken" />
                    Delete
                  </button>
                </Popconfirm>
                <button onClick={() => updateAction()}>
                  <Edit className="popIcon" variant="Broken" />
                  Update
                </button>
              </div>
            )}
          >
            <button className="act-btn all-border btn-p-s">
              <HamburgerMenu variant="Broken" values="icnax" size={20} />
            </button>
          </Dropdown>
        </div>
      </div>
      {tableLoading ? (
        <div className="laod-in">
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
