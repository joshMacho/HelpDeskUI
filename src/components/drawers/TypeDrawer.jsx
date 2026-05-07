import DeviceTypeForm from "../forms/DeviceTypeForm";
import DrawerView from "./DrawerView";

export default function TypeDrawer({ open, onClose, isEdit, info, onSuccess }) {
  return (
    <DrawerView
      title={"Device Type"}
      open={open}
      close={onClose}
      placement={"right"}
    >
      <DeviceTypeForm isEdit={isEdit} info={info} onSuccess={onSuccess} />
    </DrawerView>
  );
}
