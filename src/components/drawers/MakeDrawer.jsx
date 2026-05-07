import DeviceMakeForm from "../forms/DeviceMakeForm";
import DrawerView from "./DrawerView";

export default function MakeDrawer({ open, onClose, isEdit, info, onSuccess }) {
  return (
    <DrawerView
      title={"Device Make"}
      open={open}
      close={onClose}
      placement={"right"}
    >
      <DeviceMakeForm isEdit={isEdit} info={info} onSuccess={onSuccess} />
    </DrawerView>
  );
}
