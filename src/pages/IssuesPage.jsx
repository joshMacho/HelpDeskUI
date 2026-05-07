import { Popover } from "antd";
import { Add } from "iconsax-reactjs";
import { useState } from "react";
import AssignDeviceModal from "../components/modal/AssignDeviceModal";
import IncidentTable from "../components/tables/IncidentTable";

export default function IssuesPage() {
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
    <>
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
          <Popover placement="top" content={`Report an Issue`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={openAssignView}
            >
              <Add variant="outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          <IncidentTable />
        </div>
      </div>
    </>
  );
}
