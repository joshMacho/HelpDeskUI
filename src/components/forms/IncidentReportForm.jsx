import { useFormik } from "formik";
import { incidentReportValidation } from "../../configurations/formValidation";
import { Input, Select } from "antd";
import api from "../../api";
import { message } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function IncidentReportForm() {
  // embeded user info
  const credentials = useSelector((state) => state.credentials.user);

  const [incidentTypes, setIncidentTypes] = useState([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [messageApi, content] = message.useMessage();
  const [userLoading, setUserLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const { TextArea } = Input;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      issue_type: "",
      description: "",
      request_for: credentials?.user_id || "",
    },
    validationSchema: incidentReportValidation,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await submitForm(values, setSubmitting, resetForm);
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchIncidentTypes = async () => {
    // fetch the incident types
    try {
      setTypeLoading(true);
      const response = await api.get(`/getissuetypes`);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch incident types`,
        );
      setIncidentTypes(response?.data?.data || []);
    } catch (error) {
      console.log(`Error from fetching incident types`, error);
      return toast.error(
        error?.response?.data?.error ||
          `Unable to fetch incident types. Contact Admin / check connection`,
      );
    } finally {
      setTypeLoading(false);
    }
  };

  // get users
  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const response = await api.get(`/getusersforusers`);
      if (!response?.data?.success)
        return messageApi.error(response?.data?.error || `Unable to get users`);
      setUsers(response?.data?.data || []);
      setUserLoading(false);
    } catch (error) {
      console.log(`Error from getting users (user): `, error);
      return toast.error(
        error?.response?.data?.error ||
          `Error getting users. Check connection / contact admin`,
      );
    }
  };

  // submit the form
  const submitForm = async (values, setSubmitting, resetForm) => {
    try {
      setSubmitting(true);
      const response = await api.post(`/reportincident`, values);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to report incident`,
        );
      resetForm();
      navigate("/incidentReport/issues");
      return toast.success(
        response?.data?.message || `Incident reported successfully`,
      );
    } catch (error) {
      console.log(`Error from submitting incident report`, error);
      return toast.error(
        error?.response?.data?.error ||
          `Error submitting incident report. Contact Admin / Check connection`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="form">
      {content}
      <fieldset className="user-form" disabled={formik.isSubmitting}>
        <div className="form-input col-span-1">
          <label htmlFor="title">Title</label>
          <div className="input-div">
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <small className="danger">{formik.errors.title}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-1">
          <label htmlFor="issue_type">Issue Type</label>
          <div className="input-div">
            <Select
              name="issue_type"
              id="issue_type"
              className="custom-select"
              variant="borderless"
              placeholder="Select Issue Type"
              onChange={(value) => {
                formik.setFieldValue("issue_type", value);
                formik.setFieldTouched("issue_type", true);
              }}
              onBlur={() => formik.setFieldTouched("issue_type", true)}
              value={formik.values.issue_type || null}
              onOpenChange={(visible) => {
                if (visible) fetchIncidentTypes();
              }}
              options={incidentTypes?.map((type) => ({
                value: type.id,
                label: type.name,
              }))}
              loading={typeLoading}
            />
            {formik.touched.issue_type && formik.errors.issue_type && (
              <small className="danger">{formik.errors.issue_type}</small>
            )}
          </div>
        </div>
        <div className="form input col-span-2">
          <label htmlFor="for">Affected User</label>
          <div className="input-div">
            <Select
              showSearch
              name="request_for"
              id="request_for"
              className="custom-select"
              variant="borderless"
              value={formik.values.request_for || null}
              placeholder="Select Affected User"
              onChange={(value) => {
                formik.setFieldValue("request_for", value);
                formik.setFieldTouched("request_for", true);
              }}
              onBlur={() => formik.setFieldTouched("request_for", true)}
              onOpenChange={(visible) => {
                if (visible) fetchUsers();
              }}
              options={users?.map((user) => ({
                label: user.fullName,
                value: user.user_id,
              }))}
              loading={userLoading}
              optionFilterProp="label"
            />
            {formik.touched.request_for && formik.errors.request_for && (
              <small className="danger">{formik.errors.request_for}</small>
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
              placeholder="Describe the issue"
              maxLength={500}
              value={formik.values.description}
              count={{ show: true, max: 500 }}
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
          Create
          {formik.isSubmitting ? <Loading /> : ""}
        </button>
      </div>
    </form>
  );
}
