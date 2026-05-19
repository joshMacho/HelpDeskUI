// forms/DynamicForm.jsx
import { useForm, FormProvider } from "react-hook-form";
import SectionRenderer from "./SectionRenderer";
import api from "../../api";
import { toast } from "react-toastify";
import { message, Tabs } from "antd";
import { useToken } from "../../TokenProtectRoute";
import { useLocation } from "react-router-dom";
import LoadingModal from "../LoadingModal";
import { Children, useEffect, useState } from "react";
import OTPModal from "../modal/OTPModal";
import PreviewModal from "../modal/PreviewModal";
import { current } from "@reduxjs/toolkit";
import { DocumentText1 } from "iconsax-reactjs";

export default function DynamicForm({ schema }) {
  const { tokenData, token } = useToken();

  const methods = useForm({
    defaultValues: {},
    mode: "onBlur",
  });

  const { watch, getValues, reset } = methods;

  // useEffect(() => {
  //   const savedDraft = localStorage.getItem(tokenData.proposal_id);
  //   if (savedDraft) {
  //     reset(JSON.parse(savedDraft));
  //   }
  // }, [reset]);

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     localStorage.setItem(tokenData.proposal_id, JSON.stringify(value));
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch]);

  useEffect(() => {
    const savedDraft = localStorage.getItem(tokenData.proposal_id);
    if (savedDraft) {
      reset(JSON.parse(savedDraft));
    }
  }, [reset]);

  const [messageApi, context] = message.useMessage();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [otpData, setOtpData] = useState({});
  const [preview, setPreview] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [activeTab, setActiveTab] = useState(schema.sections[0].name);

  const query = new URLSearchParams(location.search);

  const saveDraft = () => {
    const values = getValues();
    localStorage.setItem(tokenData.proposal_id, JSON.stringify(values));
    messageApi.info("Draft Saved ");
  };

  const handlePreview = (data) => {
    setPreview(data);
    setOpenPreview(true);
  };

  const handleError = (errors) => {
    messageApi.error("Check tabs for validations and required fields");
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
      localStorage.removeItem("formDraft");
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

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      toast.success(`Success`);

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

  // render sections in tabs
  const items = schema.sections.map((section) => ({
    key: section.name,
    label: section.label,
    children: <SectionRenderer section={section} />,
  }));

  // get field names from a section

  const currentIndex = schema.sections.findIndex((s) => s.name === activeTab);
  const next = async () => {
    // const valid = await methods.trigger();
    // console.log("valid: ", valid);
    // if (!valid) return;

    setActiveTab(schema.sections[currentIndex + 1].name);

    // if (currentIndex < schema.sections.length - 1) {
    //   setActiveTab(schema.sections[currentIndex + 1].name);
    // }
  };
  const prev = () => {
    if (currentIndex > 0) {
      setActiveTab(schema.sections[currentIndex - 1].name);
    }
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
      <form onSubmit={methods.handleSubmit(handlePreview, handleError)}>
        {/* {schema.sections.map((section) => (
          <SectionRenderer key={section.name} section={section} />
        ))} */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
        {/* <div className="form-button-div stickb">
          <button type="submit" disabled={loading}>
            Submit
          </button>
        </div> */}
        <div className="save-draft-div">
          <button type="button" onClick={() => saveDraft()}>
            <DocumentText1 className="icnax" variant="broken" />
          </button>
        </div>
        <div className="form-button-div stickb">
          {currentIndex > 0 && (
            <button type="button" onClick={prev}>
              Previous
            </button>
          )}
          {currentIndex < schema.sections.length - 1 ? (
            <button type="button" onClick={next}>
              Next
            </button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
