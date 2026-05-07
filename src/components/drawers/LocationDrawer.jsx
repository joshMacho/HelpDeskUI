import LocationForm from "../forms/LocationForm";
import DrawerView from "./DrawerView";

export default function LocationDrawer({
  open,
  onClose,
  isEdit,
  info,
  onSuccess,
}) {
  return (
    <DrawerView
      title={`Location`}
      open={open}
      close={onClose}
      placement={"right"}
    >
      <LocationForm isEdit={isEdit} info={info} onSuccess={onSuccess} />
    </DrawerView>
  );
}
