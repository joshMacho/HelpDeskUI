import { message, Popconfirm, Spin } from "antd";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { useEffect, useState } from "react";
import { CloseCircle, MinusCirlce, SearchNormal } from "iconsax-reactjs";
import { LoadingOutlined } from "@ant-design/icons";

export default function LicenseAssignDetails() {
  const { license_id } = useParams();
  const [messageApi, content] = message.useMessage();
  const [devices, setDevices] = useState({
    loading: true,
    data: [],
  });
  const [license, setLicense] = useState({
    loading: true,
    data: {},
  });
  const [loading, setLoading] = useState(false);
  const [selectedD, setSelectedD] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState({
    loading: false,
    data: [],
  });

  // get all devices on this license
  const fetchDevicesOnLicense = async () => {
    try {
      const response = await api.get(`/auth/attached/${license_id}`);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error ||
            `Unable to get devices attached to license - ${license_id}`,
        );
      setDevices((prev) => ({ ...prev, data: response?.data?.data }));
    } catch (error) {
      console.log(
        `Error from getting devices attached to ${license_id} - `,
        error,
      );
      return toast.error(
        error?.response?.data?.error ||
          `Error getting devices for ${license_id}`,
      );
    } finally {
      setDevices((prev) => ({ ...prev, loading: false }));
    }
  };

  // get license details
  const getLicenseDet = async () => {
    try {
      const response = await api.get(`/auth/getlicense/${license_id}`);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error ||
            `Unable to get devices attached to license - ${license_id}`,
        );
      setLicense((prev) => ({ ...prev, data: response?.data?.data }));
    } catch (error) {
      console.log(
        `Error from getting devices attached to ${license_id} - `,
        error,
      );
      return toast.error(
        error?.response?.data?.error ||
          `Error getting devices for ${license_id}`,
      );
    } finally {
      setLicense((prev) => ({ ...prev, loading: false }));
    }
  };

  // click to remove device
  const removeDevice = async (id) => {
    setSelectedD(id);
    try {
      setLoading(true);
      const response = await api.delete("/auth/attached", {
        data: {
          ids: [id],
        },
      });
      if (!response.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to detach device`,
        );
      setLoading(false);
      setSelectedD(null);
      removeFromState(id);
      return toast.success(
        response.data?.success || `License successfully revoked`,
      );
    } catch (error) {
      console.log(`Error from removind device: `, error);
      toast.error(error?.response?.data?.error || `Error detaching device`);
    } finally {
      setLoading(false);
    }
  };

  // remove from the state
  const removeFromState = (id) => {
    const ids = [id];
    setDevices((prev) => ({
      data: prev.data.filter((device) => !ids.includes(device.id)),
    }));
  };

  // cancel remove
  const cancelRemove = () => {
    setSelectedD(null);
  };

  // search for a particular device under license
  const searchFor = async () => {
    try {
      const response = await api.get(
        `/auth/search?key=${license.data.license_id}&criteria=${search}`,
      );
      if (!response.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to perform search`,
        );
      setSearchResult({
        loading: false,
        data: response.data?.data,
      });
    } catch (error) {
      console.log(`Error from finding search in per-license view, `, error);
      return toast.error(
        error.response?.data?.error ||
          `Error from getting search (per-license)`,
      );
    } finally {
      setSearchResult((prev) => ({ ...prev, loading: false }));
    }
  };

  // set the search field
  const setSearchField = (e) => {
    if (e.target.value.trim() === "") {
      setSearchResult((prev) => ({ loading: false, data: [] }));
    }
    setSearch(e.target.value);
  };

  // clear the search and clear the items in the search
  const clearSearch = () => {
    setSearch("");
    // clear the search data result
    setSearchResult((prev) => ({ ...prev, data: [] }));
  };

  useEffect(() => {
    fetchDevicesOnLicense();
    getLicenseDet();
  }, []);

  // loading modal effect
  if (searchResult.loading)
    return (
      <Spin
        spinning={searchResult.loading}
        fullscreen
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        tip="Please wait..."
      />
    );

  return (
    <div className="main-div">
      {content}
      <div className="top-action-div xmargin">
        <div className={`${license.loading ? "anpulse" : ""} license-title`}>
          <span className="bld">{license.data?.name}</span> -{" "}
          {license.data?.license_key}
        </div>
        <div className="table-actions">
          <div className="search-input-div">
            <input
              type="text"
              id="sch"
              name="sch"
              value={search}
              onChange={(e) => setSearchField(e)}
            />

            {search && (
              <button
                onClick={() => clearSearch()}
                style={{
                  position: "absolute",
                  right: "1px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CloseCircle size={24} color="#999" variant="Bold" />
              </button>
            )}
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => searchFor()}
          >
            <SearchNormal className="icnax" variant="Broken" />
          </button>
        </div>
      </div>
      <div className="li-grid2">
        {devices.loading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="lidev-div animate-pulse" key={index}>
                <p className="head"></p>
                <div className="dinf">
                  <span className="title w-50"></span>
                  <span></span>
                </div>
                <div className="dinf bg-gray-100 rounded-md">
                  <span className="title"></span>
                  <span></span>
                </div>
                <div className="dinf">
                  <span className="title"></span>
                  <span className="user"></span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {devices.data.length === 0 ? (
              <div className="lidev-div">
                <span>No Devices</span>
              </div>
            ) : (
              <>
                {devices.data.map((device) => (
                  <div
                    className={`lidev-div ${
                      device.device_id === selectedD ||
                      searchResult.data.includes(device.sn)
                        ? "li-selected"
                        : ""
                    }`}
                    key={device.device_id}
                  >
                    <div className="remove">
                      <Popconfirm
                        title={"Remove Device"}
                        description={`Are you sure you want to detach license from device?`}
                        onConfirm={() => removeDevice(device.id)}
                        onCancel={cancelRemove}
                        onOpenChange={(open) => {
                          if (!open) cancelRemove();
                        }}
                        okButtonProps={{
                          loading: loading,
                        }}
                        okText={"Remove"}
                        cancelText={"Cancel"}
                      >
                        <MinusCirlce
                          className="icnax"
                          variant="Bold"
                          color="red"
                          onClick={() =>
                            setSelectedD(selectedD ? null : device.device_id)
                          }
                        />
                      </Popconfirm>
                    </div>
                    <p className="head">{device?.type || ""}</p>
                    <div className="dinf">
                      <span className="title">Make: </span>
                      <span>
                        {device?.make || "make"} {device?.model || "model"}
                      </span>
                    </div>
                    <div className="dinf">
                      <span className="title">SN: </span>
                      <span>{device?.sn || "sn"}</span>
                    </div>
                    <div className="dinf">
                      <span className="title">User: </span>
                      <span className="user">{device?.fullName || ""}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
