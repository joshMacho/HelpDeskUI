import { message, Tooltip } from "antd";
import { Add, FolderOpen, Minus } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useNavigate } from "react-router-dom";
import AssignLicenseModal from "../components/modal/AssignLicenseModal";

export default function LicenseView() {
  const navigate = useNavigate();
  const [license, setLicense] = useState({
    loading: true,
    data: [
      { name: "", description: "", license_number: "", used: "" },
      { name: "", description: "", license_number: "", used: "" },
      { name: "", description: "", license_number: "", used: "" },
      { name: "", description: "", license_number: "", used: "" },
    ],
  });
  const [messageApi, context] = message.useMessage();
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedLicense,setSelectedLicense] = useState({
    license_key: "",
    license_type: ""
  });

  // get all licenses
  const getLicenses = async () => {
    try {
      setLicense((prev) => ({ ...prev, loading: true }));
      const response = await api.get("/auth/getlicenses");
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to load license info`,
        );
      setLicense((prev) => ({ ...prev, data: response.data.data }));
    } catch (error) {
      console.log(`Error from getting licenses: `, error);
      return toast.error(
        error?.response?.data?.error || `Error from getting licenses view`,
      );
    } finally {
      setLicense((prev) => ({ ...prev, loading: false }));
    }
  };

  // open page
  const openPage = (id) => {
    navigate(`${id}`);
  };

  // closing the assign license modal
  const onClose = () => {
    console.log("Assign License closed")
    setOpenAssignModal(false);
    setSelectedLicense({
      license_key: "",
      license_type: ""
    })
  }

  // Successfully assigned devices
  const onSuccessAssign = async () => {
    await getLicenses();
  }

  // open the license
  const openModal = (key, key_type) => {
    setSelectedLicense({
      license_key: key,
      license_type: key_type
    });
    setOpenAssignModal(true)
  }

  useEffect(() => {
    getLicenses();
  }, []);

  return (
    <div className="main-page">
      {openAssignModal && (
        <AssignLicenseModal
        open={openAssignModal}
        onClose={onClose}
        info={selectedLicense}
        success={onSuccessAssign}
        />
      )}
      <div className="li-grid">
        {license.data.length > 0 && !license.loading ? (
          <>
            {license.data.map((li, index) => (
              <div className="li-div grid-cols-2" key={index}>
                <div className="li-info col-span-3">
                  <div className="li-title row-span-2">{li?.name || ""}</div>
                  <div className="li-description row-span-1">
                    {li.license_key || ""}
                  </div>
                  <div className="li-used grid-rows-1">
                    {li.used || 0} / {li.license_number || 0}
                  </div>
                </div>
                <div className="li-action col-span-1">
                  <Tooltip title={`View Devices`}>
                    <button className="act-btn all-border btn-p-s"
                    onClick={() => openPage(li.license_key)}>
                      <FolderOpen
                        className="icnax"
                        size={20}
                        variant="Broken"
                      />
                    </button>
                  </Tooltip>
                  <Tooltip title={`Add Device`}>
                    <button
                      className="act-btn all-border btn-p-s"
                      onClick={() => openModal(li.license_key, li.license_type)}
                    >
                      <Add className="icnax" size={20} variant="Broken" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {license.data.map((li, index) => (
              <div className="li-div grid-cols-2 animate-pulse" key={index}>
                <div className="li-info col-span-3">
                  <div className="li-title row-span-2">{li?.name || ""}</div>
                  <div className="li-description row-span-1">
                    {li.description || ""}
                  </div>
                  <div className="li-used grid-rows-1">
                    {li.used || 0} / {li.license_number || 0}
                  </div>
                </div>
                <div className="li-action col-span-1">
                  <Tooltip title={`View Devices`}>
                    <button className="act-btn all-border btn-p-s">
                      <FolderOpen
                        className="icnax"
                        size={20}
                        variant="Broken"
                      />
                    </button>
                  </Tooltip>
                  <Tooltip title={`Add Device`}>
                    <button className="act-btn all-border btn-p-s">
                      <Add className="icnax" size={20} variant="Broken" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
