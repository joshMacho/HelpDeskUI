import { LoadingOutlined } from "@ant-design/icons";
import { Dropdown, message, Popconfirm, Spin, Table } from "antd";
import { CloseSquare, Edit, HamburgerMenu, Refresh } from "iconsax-reactjs";
import { useState } from "react";
import api from "../../api";
import { deleteLicenseAsync, setLicense } from "../../redux/licenseSlice";
import { toast } from "react-toastify";
import LoadingModal from "../LoadingModal";
import LicenseFormDrawer from "../drawers/LicenseFormDrawer";
import LocationDrawer from "../drawers/LocationDrawer";

export default function LocationTable() {
  const [messageApi, content] = message.useMessage();
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [licenseData, setLicenseData] = useState({});
  const [openUpdate, setOpenUpdate] = useState(false);
  const [locationData, setLocationData] = useState([]);

  const tableColumns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Created by",
      dataIndex: "created_by",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const dataSource = (
    Array.isArray(locationData) && locationData.length > 0 ? locationData : []
  ).map((location) => ({
    key: location.branch_id,
    name: location.name,
    created_by: location.created_by,
  }));

  // reload table
  const fetchTable = async () => {
    try {
      const response = await api.get("/getlocations");
      if (!response.data.success)
        return messageApi.error(
          response.data?.error || `Unable to fetch locations`,
        );

      setLocationData(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          `Error fetching Locations. Check connection / contact admin`,
      );
      console.log(error);
    }
  };

  const yesDelete = async () => {
    // confirm and delete
    if (selectedRowKeys.length === 0) {
      setDropOpen(false);
      return messageApi.warning(`Select a branch to delete`);
    }
    try {
      setLoader(true);
      const response = await api.delete(`/auth/deletelocation`, {
        data: { ids: selectedRowKeys },
      });
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to delete license(s)`,
        );
      toast.success(
        response?.data?.message || `Branch(es) deleted successfully`,
      );
      setDropOpen(false);
      await fetchTable();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ||
          `Error deleteing branch(es). Check connection / contact admin`,
      );
    } finally {
      setDropOpen(false);
      setLoader(false);
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
      const response = await api.get(`/auth/getlocation/${selectedRowKeys[0]}`);
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch license data`,
        );
      setLicenseData(response.data.data);
      setOpenUpdate(true);
    } catch (error) {
      console.log(`Error from fetching location update: `, error);
      return toast.error(
        error.response?.data?.error ||
          `Error getting location data. Check connection / contact admin`,
      );
    } finally {
      setLoader(false);
      setDropOpen(false);
    }
  };

  const successfullUpdate = () => {
    setOpenUpdate(false);
    setSelectedRowKeys([]);
    fetchTable();
  };

  const closeDrawer = () => {
    setOpenUpdate(false);
  };

  if (loader)
    return <LoadingModal message={`...fetching Location`} open={loader} />;

  return (
    <div className="">
      {content}
      {openUpdate && (
        <LocationDrawer
          open={openUpdate}
          onClose={closeDrawer}
          isEdit={true}
          info={licenseData}
          onSuccess={successfullUpdate}
        />
      )}
      <div className="comp-head-div">
        <div className="tab-m">
          <Dropdown
            open={dropOpen}
            placement="bottomLeft"
            trigger={["click"]}
            onOpenChange={setDropOpen}
            popupRender={() => (
              <div className="pop-render">
                <Popconfirm
                  title="Delete license"
                  description={`Are you sure you want to delete ${selectedRowKeys.length} branch(s) ?`}
                  onConfirm={yesDelete}
                  onCancel={cancelDelete}
                  okButtonProps={{
                    loading: loading,
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
          <p>Branches</p>
        </div>
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
