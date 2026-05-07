import { Popover, Table } from "antd";
import { Add, Additem, Devices } from "iconsax-reactjs";
import { useState } from "react";
import DrawerView from "../components/drawers/DrawerView";
import TypeDrawer from "../components/drawers/TypeDrawer";
import TypeTable from "../components/tables/TypeTable";
import { useSelector } from "react-redux";
import MakeTable from "../components/tables/MakeTable";
import MakeDrawer from "../components/drawers/MakeDrawer";
import DeviceDrawer from "../components/drawers/DeviceDrawer";
import DevicesTable from "../components/tables/DevicesTable";

function InventoryPage() {
  // boolean for device type drawer
  const [openType, setOpenType] = useState(false);
  const [openMake, setOpenMake] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);
  const user = useSelector((state) => state.credentials);

  // console.log(user);

  return (
    <div className="main-page">
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Add Device`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setOpenDevice(true)}
            >
              <Devices variant="Outline" className="icnax" size={20} />
            </button>
          </Popover>
          <Popover placement="top" content={`Add Device Type`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setOpenType(true)}
            >
              <Additem variant="Outline" className="icnax" size={20} />
            </button>
          </Popover>
          <Popover placement="left" content={`Add a Make`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setOpenMake(true)}
            >
              <Add variant="Outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>

      {openType && (
        <TypeDrawer
          isEdit={false}
          info={{}}
          open={openType}
          onClose={() => setOpenType(false)}
          onSuccess={() => console.log()}
        />
      )}
      {openMake && (
        <MakeDrawer
          isEdit={false}
          info={{}}
          open={openMake}
          onClose={() => setOpenMake(false)}
          onSuccess={() => console.log()}
        />
      )}
      {openDevice && (
        <DeviceDrawer
          isEdit={false}
          info={{}}
          open={openDevice}
          onClose={() => setOpenDevice(false)}
          onSuccess={() => console.log()}
        />
      )}
      <div className="in-content xmargin">
        <div className="inventory-left col-span-1">
          <TypeTable />
          <MakeTable />
        </div>
        <div className="inventory-right">
          <DevicesTable />
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
