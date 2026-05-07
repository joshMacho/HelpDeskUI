import { Popover, Splitter } from "antd";
import { UserAdd } from "iconsax-reactjs";
import { useState } from "react";
import UserDrawer from "../components/drawers/UserDrawer";
import UserTable from "../components/tables/UserTable";
import LoginTable from "../components/tables/LoginTable";

export default function UsersPage() {
  const [openUserForm, setOpenUserForm] = useState(false);

  const onSuccess = () => {
    console.log("submit successfull");
  };

  return (
    <div className="main-page">
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Add User`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setOpenUserForm(true)}
            >
              <UserAdd variant="Outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      {openUserForm && (
        <UserDrawer
          open={openUserForm}
          onClose={() => setOpenUserForm(false)}
          isEdit={false}
          info={{}}
          onSuccess={onSuccess}
        />
      )}
      <div className="split-div xmargin">
        <Splitter className="my-splitter">
          <Splitter.Panel>
            <UserTable />
          </Splitter.Panel>
          <Splitter.Panel collapsible>
            <LoginTable />
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
}
