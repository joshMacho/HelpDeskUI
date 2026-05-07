import { Drawer } from "antd";

export default function DrawerView({
  title,
  open,
  close,
  placement,
  children,
}) {
  return (
    <Drawer
      title={title}
      placement={placement}
      width={500}
      onClose={close}
      open={open}
      className="custom-drawer"
    >
      {children}
    </Drawer>
  );
}
