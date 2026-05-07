import { useFormik } from "formik";
import {
  proposalLinkValidation,
  resetPasswordValidation,
} from "../../configurations/formValidation";
import { useSelector, useDispatch } from "react-redux";
import api from "../../api";
import { message, Select } from "antd";
import { toast } from "react-toastify";
import Loading from "../ui/Loading";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProposalTypes } from "../../redux/proposalTypeSlice";

export default function SendProposalForm({ onSuccess }) {
  const user = useSelector((state) => state.credentials.user);
  const [messageApi, content] = message.useMessage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [proposalData, setProposalData] = useState([]);
  const dispatch = useDispatch();
  const proposalTypes = useSelector((state) => state.proposalTypes.data);

  useEffect(() => {
    // loadTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      proposal: "",
      fullName: "",
      email: "",
      phone: "",
    },
    validationSchema: proposalLinkValidation,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log(values);
      submitForm(values, setSubmitting, resetForm);
    },
  });

  // load the types
  const loadTypes = async () => {
    try {
      await dispatch(fetchProposalTypes());
      console.log(await dispatch(fetchProposalTypes()));
    } catch (error) {
      console.log(`Error from fetching proposal types`, error);
    }
  };

  const submitForm = async (values, setSubmitting, resetForm) => {
    try {
      const response = await api.post(`/sendproposal`, values);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to create / send proposal`,
        );
      resetForm();
      onSuccess();
      return toast.success(
        response?.data?.message || `Proposal generated successfully`,
      );
    } catch (error) {
      console.log(`Error from submitting: `, error);
      return toast.error(
        error?.response?.data?.error ||
          1`Error submitting proposal request. Check connection / contact admin`,
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
          <label htmlFor="make">Proposal Type</label>
          <div className="select-div">
            <Select
              name="proposal"
              id="proposal"
              className="custom-select"
              placeholder="Select Proposal Type"
              onChange={(value) => {
                formik.setFieldValue("proposal", value);
                formik.setFieldTouched("proposal", true);
              }}
              onBlur={() => formik.setFieldTouched("proposal", true)}
              value={formik.values.proposal || null}
              loading={proposalData.loading}
              onOpenChange={async (visible) => {
                if (visible) {
                  await dispatch(fetchProposalTypes());
                }
              }}
              options={proposalTypes?.data?.map((prop) => ({
                value: prop.id,
                label: prop.proposal_name,
              }))}
            />
            {formik.touched.proposal && formik.errors.proposal && (
              <span className="danger">{formik.errors.proposal}</span>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="current">Full Name</label>
          <div className="input-div">
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <small className="danger">{formik.errors.fullName}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-1">
          <label htmlFor="password">Email</label>
          <div className="input-div">
            <input
              type="text"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <small className="danger">{formik.errors.email}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-1">
          <label htmlFor="confirm">Phone Number</label>
          <div className="input-div">
            <input
              type="text"
              name="phone"
              id="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && (
              <small className="danger">{formik.errors.phone}</small>
            )}
          </div>
        </div>
      </fieldset>
      <div className="form-button-div">
        <button type="submit" disabled={formik.isSubmitting}>
          Generate Link
          {formik.isSubmitting && <Loading />}
        </button>
      </div>
    </form>
  );
}
