import { useFormik } from "formik";
import { resetPasswordValidation } from "../../configurations/formValidation";
import { useSelector } from "react-redux";
import api from "../../api";
import { message } from "antd";
import { toast } from "react-toastify";
import Loading from "../ui/Loading";
import { useSearchParams } from "react-router-dom";

export default function PasswordResetForm2({ onSuccess }) {
  const user = useSelector((state) => state.credentials.user);
  const [messageApi, content] = message.useMessage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const formik = useFormik({
    initialValues: {
      current: "",
      password: "",
      confirm: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: (values, { setSubmitting }) => {
      submitForm(
        { currentPassword: values.current, newPassword: values.password },
        setSubmitting
      );
    },
  });

  const submitForm = async (values, setSubmitting) => {
    try {
      const response = await api.post("/auth/self/reset-password", values);
      if (!response.data.success)
        return messageApi.error(
          response.data?.error || `Unable to update password.`
        );
      console.log(response.data);
      toast.success(response.data?.message || "Password updated successfully");
      onSuccess();
    } catch (error) {
      console.log("Reset error: ", error);
      toast.error(
        error.response?.data?.error ||
          `Error resetting password. Check connection / contact admin`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form method="POST" onSubmit={formik.handleSubmit} className="form">
      {content}
      <fieldset className="user-form" disabled={formik.isSubmitting}>
        <div className="form-input col-span-2">
          <label htmlFor="current">Current Passord</label>
          <div className="input-div">
            <input
              type="password"
              name="current"
              id="current"
              value={formik.values.current}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.current && formik.errors.current && (
              <small className="danger">{formik.errors.current}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="password">New Passord</label>
          <div className="input-div">
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <small className="danger">{formik.errors.password}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="confirm">Confirm Passord</label>
          <div className="input-div">
            <input
              type="password"
              name="confirm"
              id="confirm"
              value={formik.values.confirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirm && formik.errors.confirm && (
              <small className="danger">{formik.errors.confirm}</small>
            )}
          </div>
        </div>
      </fieldset>
      <div className="form-button-div">
        <button type="submit" disabled={formik.isSubmitting}>
          Change Password
          {formik.isSubmitting && <Loading />}
        </button>
      </div>
    </form>
  );
}
