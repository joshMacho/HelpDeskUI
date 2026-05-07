import { Input, message } from "antd";
import { useFormik } from "formik";
import Loading from "../ui/Loading";
import { deviceTypeValidation } from "../../configurations/formValidation";
import api from "../../api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateTypeAsync } from "../../redux/addTypeSlice";

export default function DeviceTypeForm({ isEdit, info, onSuccess }) {
  // desc input field from antd
  const { TextArea } = Input;
  const [messageApi, content] = message.useMessage();
  const user = useSelector((state) => state.credentials.user);
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: isEdit ? info?.name : "",
      description: isEdit ? info?.description : "",
    },
    validationSchema: deviceTypeValidation,
    onSubmit: async (values, { resetForm }) => {
      isEdit
        ? submitUpdate(values, resetForm)
        : submitForm({ ...values, user_id: user.user_id }, resetForm);
    },
  });

  const submitForm = async (values, resetForm) => {
    // done something
    try {
      const response = await api.post("/addtype", values);
      if (!response.data.success)
        messageApi.error(
          response.data?.error || `Error adding type. Contact admin`,
        );
      onSuccess();
      toast.success(response.data?.message || `Type added successfully`);
      resetForm();
    } catch (error) {
      messageApi.error(
        error.response?.data?.error || `Error adding type. Check connection`,
      );
    }
  };

  // on update
  const submitUpdate = async (values, resetForm) => {
    dispatch(updateTypeAsync({ id: info.type_id, values }))
      .unwrap()
      .then((response) => {
        if (response.success) {
          onSuccess();
          resetForm();
          return toast.success(
            response?.message || `Type Updated successfully`,
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
          <label htmlFor="type">Type Name</label>
          <div className="input-div">
            <input
              type="text"
              name="type"
              id="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.type && formik.errors.type && (
              <small className="danger">{formik.errors.type}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="description">Description</label>
          <div className="input-div">
            <TextArea
              id="description"
              name="description"
              rows={4}
              placeholder="Description..."
              maxLength={200}
              value={formik.values.description}
              count={{ show: true, max: 100 }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="custom-textarea"
            />
            {formik.touched.description && formik.errors.description && (
              <span className="danger">{formik.errors.description}</span>
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
