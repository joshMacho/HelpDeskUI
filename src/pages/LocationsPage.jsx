import { Popover } from "antd";
import { Add } from "iconsax-reactjs";
import { useState } from "react";
import LocationTable from "../components/tables/LocationTable";
import LocationDrawer from "../components/drawers/LocationDrawer";

export default function LocationsPage() {
  const [locationDrawer, setLocationDrawer] = useState(false);

  const closeDrawer = () => {
    setLocationDrawer(false);
  };

  const onSuccess = () => {
    // close
    console.log("Successfull");
  };

  return (
    <div className="main-page">
      {locationDrawer && (
        <LocationDrawer
          open={locationDrawer}
          onClose={closeDrawer}
          isEdit={false}
          info={{}}
          onSuccess={onSuccess}
        />
      )}
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Add Location`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setLocationDrawer(true)}
            >
              <Add variant="outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          <LocationTable />
        </div>
      </div>
    </div>
  );
}
