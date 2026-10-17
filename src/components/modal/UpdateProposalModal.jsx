import { message, Modal, Popconfirm } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { proposalUpdateValidation } from "../../configurations/formValidation";
import api from "../../api";
import Loading from "../ui/Loading";
import { toast } from "react-toastify";

export default function UpdateProposalModal({ id, open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [proposalDetails, setProposalDetails] = useState({});
  const [messageApi, content] = message.useMessage();

  useEffect(() => {
    getProposalDetails();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: proposalDetails?.email || "",
      phone: proposalDetails?.phoneNumber || "",
    },
    validationSchema: proposalUpdateValidation,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      updateProposal(values, setSubmitting, resetForm);
    },
  });

  const getProposalDetails = async () => {
    try {
      const response = await api.get(`/proposal/${id}`);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch proposal details`,
        );
      setProposalDetails(response?.data?.data);
    } catch (error) {
      console.log(`Error from fetching proposal details: `, error);
      return messageApi.error(
        error?.response?.data?.error ||
          `Error fetching proposal details. Check connection / contact admin`,
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProposal = async (values, setSubmitting, resetForm) => {
    try {
      const response = await api.post(`/proposal/updatepdet`, {
        fullName: proposalDetails?.receipient_name,

        proposal_ID: proposalDetails?.pl_ID,
        email: values.email,
        phoneNumber: values.phone,
      });
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
    <Modal
      header={null}
      footer={null}
      open={open}
      onCancel={onClose}
      className="custom-modal"
      maskClosable={false}
      loading={loading}
    >
      <form method="POST" onSubmit={formik.handleSubmit} className="form">
        {content}
        <fieldset className="user-form" disabled={formik.isSubmitting}>
          <div className="form-input col-span-2">
            <label htmlFor="proposal_ID">Proposal ID</label>
            <div className="input-div">
              <input
                type="text"
                name="proposal_ID"
                id="proposal_ID"
                value={proposalDetails?.pl_ID || ""}
                disabled={true}
              />
            </div>
          </div>
          <div className="form-input col-span-2">
            <label htmlFor="proposal">Proposal Type</label>
            <div className="input-div">
              <input
                type="text"
                name="proposal"
                id="proposal"
                value={proposalDetails?.proposal_name || ""}
                disabled={true}
              />
            </div>
          </div>
          <div className="form-input col-span-2">
            <label htmlFor="current">Full Name</label>
            <div className="input-div">
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={proposalDetails?.receipient_name || ""}
                disabled={true}
              />
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
          <Popconfirm
            title="Resend Proposal"
            description="Are you sure you want to update and resend this proposal?"
            okText="Submit and Resend"
            showCancel={false}
            onConfirm={() => formik.handleSubmit()}
            okButtonProps={{ loading: formik.isSubmitting }}
          >
            <button type="button" disabled={formik.isSubmitting}>
              Update and Resend Proposal
              {formik.isSubmitting && <Loading />}
            </button>
          </Popconfirm>
        </div>
      </form>
    </Modal>
  );
}
