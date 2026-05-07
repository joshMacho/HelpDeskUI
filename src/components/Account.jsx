import { Dropdown } from "antd";
import { KeySquare, Logout, Setting2, User } from "iconsax-reactjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ResetPasswordModal from "./modal/ResetPasswordModal";

export default function Account() {
  const navigate = useNavigate();
  const credentials = useSelector((state) => state.credentials.user);
  const [openDrop, setOpenDrop] = useState(false);
  const [openReset, setOpenReset] = useState(false);

  const navigateToSettings = () => {
    setOpenDrop(false);
    navigate("/settings");
  };

  const openPasswordModal = () => {
    setOpenReset(true);
    setOpenDrop(false);
  };

  const onClose = () => {
    setOpenReset(false);
  };

  const onSuccess = () => {
    setOpenReset(false);
  };

  return (
    <>
      {openReset && (
        <ResetPasswordModal
          open={openReset}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
      <Dropdown
        open={openDrop}
        placement="bottomRight"
        trigger={["click"]}
        onOpenChange={setOpenDrop}
        popupRender={() => (
          <div className="pop-render">
            <button onClick={openPasswordModal}>
              <KeySquare className="popIcon" variant="Broken" />
              Reset Passowrd
            </button>
            <button onClick={() => navigateToSettings()}>
              <Setting2 className="popIcon" variant="Broken" />
              Settings
            </button>
            <button>
              <Logout className="popIcon" variant="Broken" />
              Logout
            </button>
          </div>
        )}
      >
        <div className="u-account all-border xmargin">
          <div className="img-div rounded ">
            <User variant="Broken" className="icnax mag " size={20} />
          </div>
          <p className="user-name">{credentials?.fullName}</p>
        </div>
      </Dropdown>
    </>
  );
}
