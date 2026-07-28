import { Popover } from "antd";
import { Add, ArrowLeft } from "iconsax-reactjs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function LicenseAssignPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // go back to issues page
  const goBack = () => {
    navigate("all");
  };

  // location
  const showLocation = location.pathname !== "/licenses/all";

  return (
    <div className="main-page">
      <div className="top-action-div xmargin">
        <div className="actions-div">
          {showLocation && (
            <button
              type="button"
              className="act-btn all-border btn-p-lg"
              onClick={goBack}
            >
              <ArrowLeft variant="Broken" className="icnax" size={20} />
              -Back
            </button>
          )}
        </div>
        <div className="actions-div">
          <Popover placement="top" content={`Report an Issue`}>
            <button type="button" className="act-btn all-border btn-p-lg">
              <Add variant="outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
