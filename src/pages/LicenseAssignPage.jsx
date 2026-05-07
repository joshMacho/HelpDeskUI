import { Tooltip } from "antd";
import { Add, FolderOpen, Minus } from "iconsax-reactjs";

export default function LicenseAssignPage() {
  return (
    <div className="main-page">
      <div className="li-grid">
        <div className="li-div grid-cols-2">
          <div className="li-info col-span-3">
            <div className="li-title row-span-2">OFFICE 2023</div>
            <div className="li-description row-span-1">Description</div>
            <div className="li-used grid-rows-1">20 / 50</div>
          </div>
          <div className="li-action col-span-1">
            {/* <Tooltip title={`Add`}>
              <button className="act-btn all-border btn-p-s">
                <Add size={20} className="icnax" variant="Broken" />
              </button>
            </Tooltip>
            <Tooltip title={`Remove`}>
              <button className="act-btn all-border btn-p-s">
                <Minus size={20} className="icnax" variant="Broken" />
              </button>
            </Tooltip> */}
            <Tooltip title={`View Devices`}>
              <button className="act-btn all-border btn-p-s">
                <FolderOpen className="icnax" size={20} variant="Broken" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
