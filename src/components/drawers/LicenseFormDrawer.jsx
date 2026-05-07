import LicenseForm from "../forms/LicenseForm";
import DrawerView from "./DrawerView";

export default function LicenseFormDrawer({
  open,
  onClose,
  isEdit,
  info,
  onSuccess,
}) {
  return (
    <DrawerView
      title={`License`}
      open={open}
      close={onClose}
      placement={"right"}
    >
      <LicenseForm isEdit={isEdit} info={info} onSuccess={onSuccess} />
    </DrawerView>
  );
}
