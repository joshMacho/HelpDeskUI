import { Menu } from "antd";
import {
  BranchesOutlined,
  FolderOpenOutlined,
  FormOutlined,
  LaptopOutlined,
  SafetyOutlined,
  SettingOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function MenuList() {
  const location = useLocation();
  const credentials = useSelector((state) => state.credentials);
  const isStaff = credentials?.user?.role === "staff";

  // match the keys to my path
  const selectedKey = location.pathname.split("/")[1];

  const menuItems = [
    {
      key: "inventory",
      icon: <FolderOpenOutlined />,
      disabled: isStaff,
      label: <Link to="/inventory">Inventory</Link>,
    },
    {
      key: "licenses",
      icon: <SafetyOutlined />,
      label: <Link to="/licenses">License</Link>,
    },
    {
      key: "assigned",
      icon: <LaptopOutlined />,
      disabled: isStaff,
      label: <Link to="/assigned">Devices</Link>,
    },
    {
      key: "trail",
      icon: <BranchesOutlined />,
      disabled: isStaff,
      label: <Link to="trail">Device Trail</Link>,
    },
    // only see incident report if not an admin.
    {
      key: "incidentReport",
      icon: <WarningOutlined />,
      label: <Link to="/incidentReport">Incident Report</Link>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      disabled: isStaff,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "proposal",
      icon: <FormOutlined />,
      label: <Link to="/proposal">Proposal Form</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  // role is in credentials.role

  return (
    <Menu className="menu-bar" items={menuItems} selectedKeys={[selectedKey]} />
  );
}
export default MenuList;
