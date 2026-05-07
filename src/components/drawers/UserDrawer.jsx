import UserForm from "../forms/UserForm";
import DrawerView from "./DrawerView";

export default function UserDrawer({ open, onClose, isEdit, info, onSuccess }) {
  return (
    <DrawerView
      title={"New User"}
      open={open}
      close={onClose}
      placement={"right"}
    >
      <UserForm info={info} onSuccess={onSuccess} isEdit={isEdit} />
    </DrawerView>
  );
}
