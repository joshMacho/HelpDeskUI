import { Popover } from "antd";
import { Level } from "iconsax-reactjs";
import AssignTable from "../components/tables/AssignTable";
import { useState } from "react";
import AssignDeviceModal from "../components/modal/AssignDeviceModal";

export default function AssignPage() {
  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  const onSuccess = () => {
    console.log("Assigning successfull");
    setOpenModal(false);
  };

  const openAssignView = () => {
    setOpenModal(true);
  };

  return (
    <div className="main-page">
      {openModal && (
        <AssignDeviceModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          info={{}}
          onSuccess={onSuccess}
        />
      )}
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Assign Device`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={openAssignView}
            >
              <Level variant="outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          <AssignTable />
        </div>
      </div>
    </div>
  );
}
