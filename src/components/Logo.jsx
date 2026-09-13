import { FireFilled } from "@ant-design/icons";
import logoOnly from "../assets/logoOnly.png";

function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        {/* <FireFilled /> */}
        <img src={logoOnly} alt="Logo" />
      </div>
    </div>
  );
}
export default Logo;
