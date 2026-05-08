// forms/DynamicForm.jsx
import { useForm, FormProvider } from "react-hook-form";
import SectionRenderer from "./SectionRenderer";
import api from "../../api";
import { toast } from "react-toastify";
import { message } from "antd";
import { useToken } from "../../TokenProtectRoute";
import { useLocation } from "react-router-dom";
import LoadingModal from "../LoadingModal";
import { useState } from "react";
import OTPModal from "../modal/OTPModal";
import PreviewModal from "../modal/PreviewModal";

export default function DynamicForm({ schema }) {
  const methods = useForm({
    defaultValues: {},
    mode: "onBlur",
  });

  const { tokenData, token } = useToken();
  const [messageApi, context] = message.useMessage();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [otpData, setOtpData] = useState({});
  const [preview, setPreview] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const query = new URLSearchParams(location.search);

  const handlePreview = (data) => {
    setPreview(data);
    setOpenPreview(true);
  };

  const onSubmit = async () => {
    console.log(preview);
    // console.log(`tokenData: `, tokenData);
    console.log("token: ", token);
    try {
      setLoading(true);
      const response = await api.post(`/auth/otpsubmit`, {
        token,
        form_data: preview,
        proposal_id: tokenData.proposal_id,
        phoneNumber: tokenData.phoneNumber,
      });

      if (!response.data.success)
        return messageApi.error(
          response?.data?.error || `Unable to submit form`,
        );
      console.log(`otp from submit: `, response.data.otpData);

      // return the success status
      setOtpData(response.data.otpData);
      setOpenOtp(true);
      return toast.success(response?.data?.message || `Done`);
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.response?.data?.error ||
          `Error submitting form. Check connection / contact admin`,
      );
    } finally {
      setLoading(false);
    }
  };

  // resend function
  const resend = () => {
    // go with the form object again
  };

  // cancel window
  const cancelWindow = () => {
    setOpenOtp(false);
  };

  // on complete
  const handleComplete = async (otp) => {
    try {
      const response = await api.post(`/authorizesubmission?token=${token}`, {
        phoneNumber: tokenData.phoneNumber,
        otp_id: otpData.id,
        otp,
        proposal_id: otpData.proposal_id,
      });
      if (!response.data.success)
        return messageApi.error(response?.data?.error);

      // close modal
      setOpenOtp(false);

      // give a success message
      toast.success(response?.data?.message || `FORM SUBMITTED SUCCESSFULLY`);
    } catch (error) {
      console.log(`Error submitting form request: `, error);
      return toast.error(
        error?.response?.date?.error || `Error submitting proposal form`,
      );
    }
  };

  // handle preview
  const previewDoc = async () => {
    try {
      const response = await api.post(
        `/previewdocument/${tokenData.proposal_id}`,
        { token, data: preview },
        {
          responseType: "blob",
        },
      );

      if (!response?.data?.success)
        toast.error(response?.data?.error || `Unable to preview Document`);

      toast.success(`Success`);

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.response?.data?.error ||
          `Error previewing document. Check connection / Contact Admin`,
      );
    }
  };

  // close preview
  const closePreview = () => {
    setOpenPreview(false);
  };

  if (loading) return <LoadingModal message={`Submitting...`} open={loading} />;

  return (
    <FormProvider {...methods}>
      {openPreview && (
        <PreviewModal
          open={openPreview}
          cancel={closePreview}
          preview={previewDoc}
          submit={onSubmit}
        />
      )}
      {openOtp && (
        <OTPModal
          length={6}
          onComplete={handleComplete}
          open={true}
          duration={180}
          cancel={cancelWindow}
          resend={resend}
          data
        />
      )}
      {context}
      <form onSubmit={methods.handleSubmit(handlePreview)}>
        {schema.sections.map((section) => (
          <SectionRenderer key={section.name} section={section} />
        ))}
        <div className="form-button-div stickb">
          <button type="submit" disabled={loading}>
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
