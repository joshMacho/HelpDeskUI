import { message } from "antd";
import { useFormik } from "formik";
import { productValidaiton } from "../../configurations/formValidation";
import api from "../../api";
import Loading from "../ui/Loading";
import { toast } from "react-toastify";

export default function ProductForm({ isEdit, info, onSuccess }) {
  const [messageApi, content] = message.useMessage();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      product_name: isEdit ? info?.product_name : "",
    },
    validationSchema: productValidaiton,
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
      const response = await api.post("/products", values);
      if (!response.data?.success)
        return messageApi.error(
          response.data?.error || `Unable to add product`,
        );
      toast.success(response.data?.message || `Product added successfully`);
      resetForm();
      onSuccess();
    } catch (error) {
      return toast.error(
        error.response?.data?.error ||
          `Error adding product. Check connection / contact admin`,
      );
    } finally {
      formik.setSubmitting(false);
    }
  };

  // submit update
  const submitUpdate = async (values, resetForm) => {
    try {
      const response = await api.put(`/products/${info.id}`, values);
      if (!response.data?.success)
        return messageApi.error(
          response.data?.error || `Unable to update product`,
        );
      toast.success(response.data?.message || `Product updated successfully`);
      resetForm();
      onSuccess();
    } catch (error) {
      return toast.error(
        error.response?.data?.error ||
          `Error updating product. Check connection / contact admin`,
      );
    } finally {
      formik.setSubmitting(false);
    }
  };

  return (
    <form className="form" method="POST" onSubmit={formik.handleSubmit}>
      {content}
      <fieldset className="user-form" disabled={formik.isSubmitting}>
        <div className="form-input col-span-2">
          <label htmlFor="product_name">Product Name</label>
          <div className="input-div">
            <input
              type="text"
              name="product_name"
              id="product_name"
              value={formik.values.product_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isEdit}
            />
            {formik.touched.product_name && formik.errors.product_name && (
              <small className="danger">{formik.errors.product_name}</small>
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
