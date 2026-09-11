import { useFormik } from "formik";
import api from "../api";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Loading from "../components/ui/Loading";
import { AuthContext } from "../../AuthContext";
import { setCredentials, setUserLoading } from "../redux/credentialsSlice";
import { toast } from "react-toastify";
import EmailResetModal from "../components/modal/EmailResetModal";
import { useMsal } from "@azure/msal-react";
import { loginRequest, apiRequest } from "../api/authConfig";
import microsoftApi from "../api/microsoftIndex";
import microsoftLogo from "../assets/microsoft.png";
import nsiaLogo from "../assets/logoOnly.png";

function Login() {
  const user = useSelector((state) => state.credentials);
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [openResetModal, setOpenResetModal] = useState(false);
  const { instance } = useMsal();

  const [messageApi, content] = message.useMessage();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      submitLogin(values);
    },
  });

  // if (user?.user) return <Navigate to={from} replace />;

  const submitLogin = async (values) => {
    dispatch(setUserLoading(true));
    try {
      const response = await api.post("/auth/login", values, {
        withCredentials: true,
      });

      const auth = await response.data;
      if (!auth.success) {
        messageApi.error(auth?.error || `Invalid username & password`);
      }
      // await login(auth.data)
      dispatch(setCredentials({ user: auth.data, token: auth.token }));
      toast.success(auth.message || `Login Successfull👍`);
      console.log(`from: `, from);
      return navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      messageApi.error(
        error?.response?.data?.error || `Error logging in. Contact Admin`,
      );
      console.log(`Error from login: `, error.message);
      //dispatch(setUserLoading(false));
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  const closeModal = () => {
    setOpenResetModal(false);
  };

  const onSuccess = () => {
    closeModal();
  };

  // login with microsoft
  const loginWithMicrosoft = async () => {
    try {
      dispatch(setUserLoading(true));
      // 1. Sign in with Microsoft
      const loginResponse = await instance.loginPopup(loginRequest);

      // 2. Get an access token for YOUR API
      const tokenResponse = await instance.acquireTokenSilent({
        ...apiRequest,
        account: loginResponse.account,
        forceRefresh: true,
      });

      // 3. Send Microsoft token to Node
      const response = await microsoftApi.post(
        "/auth/microsoft",
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        },
      );

      const result = response.data;

      if (!result.success) {
        toast.error(result.error || "Microsoft login failed");
        return;
      }

      // Your backend should return your normal application user data/token
      dispatch(
        setCredentials({
          user: result.data,
          token: result.token,
        }),
      );

      toast.success(result.message || "Login successful");

      navigate("/", { replace: true });
    } catch (error) {
      console.error(
        "Microsoft login failed:",
        error?.response?.data || error.message,
      );
      toast.error(
        error?.response?.data?.error || "Microsoft login failed. Contact Admin",
      );
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  // const loginWithMicrosoft = async () => {
  //   try {
  //     const loginResponse = await instance.loginPopup(loginRequest);
  //     console.log("Microsoft account:", loginResponse.account);
  //     console.log("SUCCESS");
  //     console.log(loginResponse.account);
  //   } catch (error) {
  //     console.error("Microsoft login failed:", error);
  //   }
  // };

  return (
    <div className="login-page">
      {content}
      {openResetModal && (
        <EmailResetModal
          open={openResetModal}
          onClose={closeModal}
          onSuccess={onSuccess}
        />
      )}
      <div className="login-div">
        <div className="login-header">
          <img src={nsiaLogo} alt="Logo" className="login-logo" />
          <p>Welcome to NSIA Insurance Virtual proposal Platform</p>
        </div>
        <form
          className="loginform"
          method="POST"
          onSubmit={formik.handleSubmit}
        >
          <fieldset className="user-form">
            <div className="form-input col-span-2">
              <label htmlFor="username">Username</label>
              <div className="input-div">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className="form-input col-span-2">
              <label htmlFor="password">Password</label>
              <div className="input-div">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </fieldset>
          <div className="login-button-div">
            <button disabled={user.userLoading} type="submit">
              <p>Login</p>
              {user.userLoading ? <Loading /> : ""}
            </button>
            <div className="forgoten-pw">
              <p onClick={() => setOpenResetModal(true)}>Forgot Password</p>
            </div>
          </div>

          <div className="login-button-div">
            <button
              type="button"
              onClick={() => {
                loginWithMicrosoft();
              }}
              disabled={user.userLoading}
            >
              <img src={microsoftLogo} alt="Logo" className="microsoft-logo" />
              <p>Sign in with Microsoft</p>
              {user.userLoading ? <Loading /> : ""}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
