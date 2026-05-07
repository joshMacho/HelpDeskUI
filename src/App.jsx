import "./App.css";
import "./index.css";
import { Button, ConfigProvider, Layout, Slider, theme } from "antd";
import Logo from "./components/Logo";
import MenuList from "./components/MenuList";
import { MenuOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../AuthContext";
import Account from "./components/Account";
const { Header, Sider, Content } = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { settings, setCollapse, setCollapseWithValue } = useAuth();

  return (
    <ConfigProvider>
      <Layout className="layout">
        <Sider
          theme="light"
          className="sidebar"
          collapsed={settings.menuCollapse}
          collapsible
          trigger={null}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) setCollapseWithValue(broken);
          }}
        >
          <Logo />
          <MenuList />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button type="text" onClick={() => setCollapse()}>
              <MenuOutlined />
            </Button>
            <Account />
          </Header>
          <Content className="content-body">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
