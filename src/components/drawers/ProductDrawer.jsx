import ProductForm from "../forms/ProductForm";
import DrawerView from "./DrawerView";

export default function ProductDrawer({
  open,
  onClose,
  isEdit,
  info,
  onSuccess,
}) {
  return (
    <DrawerView
      title={`Product`}
      open={open}
      close={onClose}
      placement={"right"}
    >
      <ProductForm isEdit={isEdit} info={info} onSuccess={onSuccess} />
    </DrawerView>
  );
}
