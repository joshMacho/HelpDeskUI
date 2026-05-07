import {
  AimOutlined,
  BoxPlotFilled,
  BoxPlotOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function SettingsPage() {
  const { Sider, Content } = Layout;

  const location = useLocation();
  // extract last part of the url
  const selectedKey = location.pathname.split("/").pop();

  return (
    <Layout className="layout">
      <Sider
        collapsed
        collapsible
        trigger={null}
        className="sidebar"
        theme="light"
      >
        <Menu
          mode="inline"
          className="menu-bar mr-2"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={["profile"]}
          items={[
            {
              key: "profile",
              icon: <UserOutlined />,
              label: <Link to="/profile">Profile</Link>,
            },
            {
              key: "license",
              icon: <SafetyOutlined />,
              label: <Link to="license">License</Link>,
            },
            {
              key: "locations",
              icon: <EnvironmentOutlined />,
              label: <Link to="locations">Locations</Link>,
            },
            {
              key: "departments",
              icon: <BoxPlotOutlined />,
              label: <Link to="departments">Department</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
