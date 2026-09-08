import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "./api";
import LoadingModal from "./components/LoadingModal";
import { Modal } from "antd";
import { Warning2 } from "iconsax-reactjs";
import { toast } from "react-toastify";

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
      setTokenData(response.data.data);
      setValid(true);
    } catch (error) {
      console.log("ERROR HIT");
      setError(error?.response?.data || "Invalid token");
      console.log(`error from verify: `, error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const viewSubmitted = async (proposal_id, token) => {
    console.log(tokenData);
    // const previewUrl = `${import.meta.env.VITE_API_BASE_URL}/document/${proposal_id}/preview`;
    try {
      const response = await api.post(`/document/${proposal_id}/view`, {
        token,
      });
      if (!response?.data.success) toast.error(`error viewing form`);
      window.open(response?.data?.url, "_blank");
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          `Network Error - Unable to view document`,
      );
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
        loading={loading}
      >
        <div className="errorView">
          <Warning2 size={48} className="icnax" variant="Broken" />
          <p>{error.error}</p>
          <span
            className="text-blue-400 hover:underline"
            onClick={() => viewSubmitted(error?.proposal_id, error?.token)}
          >
            View Document
          </span>
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
