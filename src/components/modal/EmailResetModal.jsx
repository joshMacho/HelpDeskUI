import { message, Modal } from "antd";
import { useFormik } from "formik";
import { resetEmailValidation } from "../../configurations/formValidation";
import Loading from "../ui/Loading";
import api from "../../api";
import { toast } from "react-toastify";

export default function EmailResetModal({ open, onClose, onSuccess }) {
  const [messageApi, content] = message.useMessage();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: resetEmailValidation,
    onSubmit: (values, { setSubmitting }) => {
      submitRequest(values.email, setSubmitting);
    },
  });

  const submitRequest = async (email, setSubmitting) => {
    try {
      const response = await api.post(`/auth/resetrequest`, {
        identity: email,
      });
      if (!response.data.success)
        return messageApi.error(
          response.data?.error ||
            `Error reseting password, check connection or check email`
        );
      toast.success(
        response.data?.success || `Password reset link sent successfully`
      );
      console.log(response);
      onSuccess();
    } catch (error) {
      console.log(`restting error: `, error);
      toast.error(
        error.response.data.error ||
          `Error reseting password. Check connection / contact admin`
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal
      title={`Reset Password`}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      styles={{
        mask: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgb(0,0,0,0.45)", // optional keeps dim
        },
      }}
    >
      <form className="form" method="post" onSubmit={formik.handleSubmit}>
        {content}
        <p className="text-gray-600">
          Enter your email address and we’ll send you a reset link.
        </p>
        <fieldset className="user-form" disabled={formik.isSubmitting}>
          <div className="form-input col-span-2">
            <label htmlFor="email">Email</label>
            <div className="input-div">
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <small className="danger">{formik.errors.email}</small>
              )}
            </div>
          </div>
        </fieldset>
        <div className="form-button-div">
          <button type="submit" disabled={formik.isSubmitting}>
            Send Reset Link
            {formik.isSubmitting ? <Loading /> : ""}
          </button>
        </div>
      </form>
    </Modal>
  );
}
