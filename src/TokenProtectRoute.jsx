import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "./api";
import LoadingModal from "./components/LoadingModal";
import { Modal } from "antd";
import { Warning2 } from "iconsax-reactjs";

export const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export default function TokenProtectRoute({ children }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);
  const [tokenData, setTokenData] = useState({});

  // context

  useEffect(() => {
    if (!token) {
      setError("MISSING TOKEN");
      setLoading(false);
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.get(`/auth/proposal/verify?token=${token}`);
      //console.log(`response: `, response);
      setTokenData(response.data.data);
      setValid(true);
    } catch (error) {
      console.log("ERROR HIT");
      setError(error?.response?.data?.error || "Invalid token");
      console.log(`error from verify: `, error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingModal message={`Validating Link...`} open={loading} />;
  }

  if (error) {
    return (
      <Modal
        header={null}
        open={error}
        footer={null}
        closable={false}
        className="custom-modal"
      >
        <div className="errorView">
          <Warning2 size={48} className="icnax" variant="Broken" />
          <p>{error}</p>
        </div>
      </Modal>
    );
  }

  return (
    <TokenContext.Provider value={{ tokenData, token }}>
      {children}
    </TokenContext.Provider>
  );
}
