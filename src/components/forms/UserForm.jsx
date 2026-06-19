import { useFormik } from "formik";
import { userValidation } from "../../configurations/formValidation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { message, Select } from "antd";
import Loading from "../ui/Loading";
import { getDepartments, getLocations } from "../../data";
import { toast } from "react-toastify";
import { addUserAsync, updateUserAsync } from "../../redux/userSlice";

export default function UserForm({ isEdit, onSuccess, info }) {
  const user = useSelector((state) => state.credentials.user);
  const dispatch = useDispatch();

  const [messageApi, content] = message.useMessage();
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: isEdit ? info.fullName : "",
      email: isEdit ? info.email : "",
      department: isEdit ? info.department : "",
      location: isEdit ? info.location : "",
    },
    validationSchema: userValidation,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      if (isEdit) {
        const payload = getTouchedAndChanged(
          values,
          formik.touched,
          formik.initialValues,
        );
        submitUpdate(payload, resetForm, setSubmitting);
      } else {
        submitForm({ user_id: user.user_id, ...values }, resetForm);
      }
    },
  });
  //submitUpdate(values, resetForm)

  useEffect(() => {
    fetchLocations();
    fetchDepartments();
  }, []);

  // submit form
  const submitForm = (values, resetForm) => {
    dispatch(addUserAsync(values))
      .unwrap()
      .then((response) => {
        if (!response.success)
          return messageApi.error(response?.error || `Error creating user`);
        toast.success(response?.message || `User created successfully`);
        onSuccess();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.error || `Error contacting server. User add error.`);
      });
  };

  // get only touched and changed fields
  const getTouchedAndChanged = (values, touched, initialValues) => {
    return Object.keys(touched).reduce((acc, key) => {
      if (values[key] !== initialValues[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  };

  // submit update
  const submitUpdate = async (values, resetForm, setSubmitting) => {
    try {
      const response = await dispatch(
        updateUserAsync({ id: info.user_id, values }),
      ).unwrap();
      if (!response.success)
        return messageApi.error(
          response?.data?.error || "Unable to update user",
        );
      toast.success(response?.message || "User successfully updated");
      resetForm();
      onSuccess();
    } catch (error) {
      console.log("Error from update user: ", error);
      toast.error(
        error?.error || "Error updating user. Check connection / contact admin",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // delete user
  const deleteUser = () => {};

  // get locations
  const fetchLocations = async () => {
    try {
      const locations = await getLocations();
      if (!locations.success) return messageApi.error(locations.error);
      setLocations(locations.data);
    } catch (error) {
      console.log(error);
      return toast.error(
        error.resposne?.data?.error ||
          error?.message ||
          `Error loading locations.`,
      );
    }
  };

  // get departments
  const fetchDepartments = async () => {
    try {
      const departments = await getDepartments();
      if (!departments.success) return messageApi.error(departments.error);
      setDepartments(departments.data);
    } catch (error) {
      console.log(error);
      return toast.error(
        error.response?.data?.error ||
          error?.message ||
          `Error contactiong server for departments`,
      );
    }
  };

  return (
    <form method="POST" onSubmit={formik.handleSubmit} className="form">
      {content}
      <fieldset disabled={formik.isSubmitting}>
        <div className="form-input col-span-2">
          <label htmlFor="fullName">Full Name</label>
          <div className="input-div">
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <small className="danger">{formik.errors.fullName}</small>
            )}
          </div>
        </div>
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
        <div className="form-input col-span-2">
          <label htmlFor="department">Department</label>
          <div className="select-div">
            <Select
              name="department"
              id="department"
              className="custom-select"
              variant="borderless"
              placeholder="Select make"
              onChange={(value) => {
                formik.setFieldValue("department", value);
                formik.setFieldTouched("department", true);
              }}
              onBlur={() => formik.setFieldTouched("department", true)}
              value={formik.values.department || null}
              onOpenChange={(visible) => {
                if (visible) fetchDepartments();
              }}
              options={departments.map((item) => ({
                value: item.dept_id,
                label: item.name,
              }))}
            />
            {formik.touched.department && formik.errors.department && (
              <span className="danger">{formik.errors.department}</span>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="location">Location</label>
          <div className="select-div">
            <Select
              name="location"
              id="location"
              className="custom-select"
              variant="borderless"
              placeholder="Select make"
              onChange={(value) => {
                formik.setFieldValue("location", value);
                formik.setFieldTouched("location", true);
              }}
              onBlur={() => formik.setFieldTouched("location", true)}
              value={formik.values.location || null}
              onOpenChange={(visible) => {
                if (visible) {
                  fetchLocations();
                }
              }}
              options={locations.map((item) => ({
                value: item.branch_id,
                label: item.name,
              }))}
            />
            {formik.touched.location && formik.errors.location && (
              <span className="danger">{formik.errors.location}</span>
            )}
          </div>
        </div>
      </fieldset>
      <div className="form-button-div">
        <button type="submit" disabled={formik.isSubmitting}>
          {isEdit ? "Update" : "Add User"}
          {formik.isSubmitting ? <Loading /> : ""}
        </button>
      </div>
    </form>
  );
}
