import DeviceForm from "../forms/DeviceForm";
import DrawerView from "./DrawerView";

export default function DeviceDrawer({
  open,
  onClose,
  isEdit,
  info,
  onSuccess,
}) {
  return (
    <DrawerView
      title={"Device"}
      open={open}
      close={onClose}
      placement={"right"}
    >
      <DeviceForm isEdit={isEdit} info={info} onSuccess={onSuccess} />
    </DrawerView>
  );
}
