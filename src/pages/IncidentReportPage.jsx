import { Popover } from "antd";
import { Add } from "iconsax-reactjs";
import { Outlet } from "react-router-dom";

export default function IncidentReportPage() {
  const handleComplete = (otp) => {
    console.log("OTP entered: ", otp);
  };
  return (
    <div className="main-page">
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Report an Issue`}>
            <button className="act-btn all-border btn-p-lg">
              <Add variant="outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          {/* <IncidentTable /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
