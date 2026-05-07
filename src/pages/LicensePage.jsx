import { Popover } from "antd";
import { KeySquare } from "iconsax-reactjs";
import LicenseTable from "../components/tables/LicenseTable";
import { useState } from "react";
import LicenseFormDrawer from "../components/drawers/LicenseFormDrawer";

export default function License() {
  const [licenseDrawer, setLicenseDrawer] = useState(false);

  const closeDrawer = () => {
    setLicenseDrawer(false);
  };

  const onSuccess = () => {
    // close
    console.log("Successfull");
  };

  return (
    <div className="main-page">
      {licenseDrawer && (
        <LicenseFormDrawer
          open={licenseDrawer}
          onClose={closeDrawer}
          isEdit={false}
          info={{}}
          onSuccess={onSuccess}
        />
      )}
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Add License`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setLicenseDrawer(true)}
            >
              <KeySquare variant="outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          <LicenseTable />
        </div>
      </div>
    </div>
  );
}
