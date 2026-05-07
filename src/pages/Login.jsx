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

function Login() {
  const user = useSelector((state) => state.credentials);
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [openResetModal, setOpenResetModal] = useState(false);

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
          </div>
          <div className="forgoten-pw">
            <p onClick={() => setOpenResetModal(true)}>Forgot Password</p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
