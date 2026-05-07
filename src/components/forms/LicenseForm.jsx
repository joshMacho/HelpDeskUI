import { useFormik } from "formik";
import { licenseValidation } from "../../configurations/formValidation";
import Loading from "../ui/Loading";
import { Input, message } from "antd";
import { useDispatch } from "react-redux";
import { addLicenseAsync, updateLicenseAsync } from "../../redux/licenseSlice";
import { toast } from "react-toastify";

export default function LicenseForm({ isEdit, info, onSuccess }) {
  const dispatch = useDispatch();
  const [messageApi, content] = message.useMessage();
  const { TextArea } = Input;

  const formik = useFormik({
    initialValues: {
      license_key: isEdit ? info?.license_key : "",
      name: isEdit ? info?.name : "",
      license_number: isEdit ? info?.license_number : "",
      description: isEdit ? info?.description : "",
    },
    validationSchema: licenseValidation,
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
      const response = await dispatch(addLicenseAsync(values)).unwrap();
      if (!response?.success)
        return messageApi.error(
          response?.data?.error || `Unable to add license`,
        );
      toast.success(response?.message || `License added successfully`);
      resetForm();
      onSuccess();
    } catch (error) {
      toast.error(
        error?.error ||
          `Error adding license. Check connection / contact admin`,
      );
    } finally {
      formik.setSubmitting(false);
    }
  };

  // submit update
  const submitUpdate = async (values, resetForm) => {
    try {
      const response = await dispatch(
        updateLicenseAsync({ id: info.license_key, values }),
      ).unwrap();
      if (!response.success)
        return messageApi.error(
          response?.data?.error || `Unable to update license`,
        );
      toast.success(response?.message || `License updated successfully`);
      resetForm();
      onSuccess();
    } catch (error) {
      console.log(`error from updating license`);
      toast.error(
        error?.error ||
          `Error updating license. Check connection / contact admin`,
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
          <label htmlFor="license_key">License ID</label>
          <div className="input-div">
            <input
              type="text"
              name="license_key"
              id="license_key"
              value={formik.values.license_key}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isEdit}
            />
            {formik.touched.license_key && formik.errors.license_key && (
              <small className="danger">{formik.errors.license_key}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-1">
          <label htmlFor="name">License Name</label>
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
        <div className="form-input col-span-1">
          <label htmlFor="license_number">Number of License</label>
          <div className="input-div">
            <input
              type="text"
              name="license_number"
              id="license_number"
              value={formik.values.license_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.license_number && formik.errors.license_number && (
              <small className="danger">{formik.errors.license_number}</small>
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
              maxLength={100}
              value={formik.values.description}
              count={{ show: true, max: 200 }}
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
          {formik.isSubmitting && <Loading />}
        </button>
      </div>
    </form>
  );
}
