import { Input, message } from "antd";
import { useFormik } from "formik";
import Loading from "../ui/Loading";
import { deviceMakeValidation } from "../../configurations/formValidation";
import api from "../../api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateMakeAsync } from "../../redux/deviceMakeSlice";

export default function DeviceMakeForm({ isEdit, info, onSuccess }) {
  // desc input field from antd
  const { TextArea } = Input;
  const [messageApi, content] = message.useMessage();
  const user = useSelector((state) => state.credentials.user);
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: isEdit ? info?.name : "",
    },
    validationSchema: deviceMakeValidation,
    onSubmit: async (values, { resetForm }) => {
      isEdit
        ? submitUpdate(values, resetForm)
        : submitForm({ ...values, user_id: user.user_id }, resetForm);
    },
  });

  const submitForm = async (values, resetForm) => {
    // done something
    try {
      const response = await api.post("/addmake", values);
      if (!response.data.success)
        messageApi.error(
          response.data?.error || `Error adding make. Contact admin`
        );
      onSuccess();
      toast.success(response.data?.message || `Type added successfully`);
      resetForm();
    } catch (error) {
      messageApi.error(
        error.response?.data?.error || `Error adding type. Check connection`
      );
    }
  };

  // on update
  const submitUpdate = async (values, resetForm) => {
    dispatch(updateMakeAsync({ id: info.make_id, values }))
      .unwrap()
      .then((response) => {
        if (response.success) {
          onSuccess();
          resetForm();
          return toast.success(
            response?.message || `Type Updated successfully`
          );
        }
      })
      .catch((error) => {
        toast.error(error.error);
        console.log(error);
      });
  };

  return (
    <form onSubmit={formik.handleSubmit} method="POST" className="form">
      {content}
      <fieldset className="user-form" disabled={formik.isSubmitting}>
        <div className="form-input col-span-2">
          <label htmlFor="name">Make Name</label>
          <div className="input-div">
            <input
              type="text"
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <small className="danger">{formik.errors.name}</small>
            )}
          </div>
        </div>
      </fieldset>
      <div className="form-button-div">
        <button type="submit" disabled={formik.isSubmitting}>
          {isEdit ? "Update" : "Save"}
          {formik.isSubmitting ? <Loading /> : ""}
        </button>
      </div>
    </form>
  );
}
