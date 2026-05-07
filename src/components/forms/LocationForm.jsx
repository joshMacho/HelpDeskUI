import { useFormik } from "formik";
import { locationValidation } from "../../configurations/formValidation";
import Loading from "../ui/Loading";
import { Input, message } from "antd";
import { useDispatch } from "react-redux";
import { addLicenseAsync, updateLicenseAsync } from "../../redux/licenseSlice";
import { toast } from "react-toastify";
import api from "../../api";

export default function LocationForm({ isEdit, info, onSuccess }) {
  const [messageApi, content] = message.useMessage();

  const formik = useFormik({
    initialValues: {
      name: isEdit ? info?.name : "",
    },
    validationSchema: locationValidation,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      if (isEdit) {
        submitUpdate(values, resetForm);
      } else {
        submitForm(values, resetForm);
      }
    },
  });

  // submit form
  const submitForm = async (values, resetForm) => {
    try {
      const response = await api.post("/auth/addlocation", values);
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to add location`,
        );
      toast.success(response?.data?.message || `Location added successfully`);
      resetForm();
      onSuccess();
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          `Error adding location. Check connection / contact admin`,
      );
    } finally {
      formik.setSubmitting(false);
    }
  };

  // submit update
  const submitUpdate = async (values, resetForm) => {
    try {
      const response = await api.post(
        `/auth/updatelocation/${info.branch_id}`,
        values,
      );
      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to update location`,
        );
      toast.success(response?.data?.message || `Location updated successfully`);
      resetForm();
      onSuccess();
    } catch (error) {
      console.log(`error from updating location`);
      toast.error(
        error?.response?.data?.error ||
          `Error updating location. Check connection / contact admin`,
      );
    } finally {
      formik.setSubmitting(false);
    }
  };

  // delete key
  const deleteLicense = async (ids) => {};

  return (
    <form className="form" method="POST" onSubmit={formik.handleSubmit}>
      {content}
      <fieldset className="user-form" disabled={formik.isSubmitting}>
        <div className="form-input col-span-2">
          <label htmlFor="name">Location Name</label>
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
          {formik.isSubmitting && <Loading />}
        </button>
      </div>
    </form>
  );
}
