import { message, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { incidentStatusValidation } from "../../configurations/formValidation";
import api from "../../api";
import Loading from "../ui/Loading";

export default function SetStateModal({ incident_id, open, cancel, success }) {
  const [statLoading, setStatLoading] = useState(false);
  const [messageApi, content] = message.useMessage();
  const [states, setStates] = useState([]);

  const formik = useFormik({
    initialValues: {
      state: "",
    },
    validationSchema: incidentStatusValidation,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      handleSubmit(values, setSubmitting, resetForm);
    },
  });

  // hadle submit
  const handleSubmit = async (values, setSubmitting, resetForm) => {
    setSubmitting(true);
    try {
      const response = await api.post(`/setstate`, {
        incident_id,
        status_id: values.state,
      });
      if (!response?.data?.success)
        return messageApi.error(response?.data?.error || `Unable to set state`);
      resetForm();
      success(response?.data?.message || `State set successfully`);
    } catch (error) {
      console.log(error);
      return toast.error(error?.response?.data?.error || `Unable to set state`);
    } finally {
      setSubmitting(false);
    }
  };

  // fetch state
  const fetchState = async () => {
    try {
      setStatLoading(true);
      const response = await api.get("/getstates");
      if (!response?.data?.success) {
        setStates([]);
        return messageApi.error(
          response?.data?.error || `Unable to fetch states`,
        );
      }
      setStates(response?.data?.data || []);
      console.log(response?.data?.data || []);
    } catch (error) {
      console.log(error);
      setStates([]);
      return toast.error(
        error?.response?.data?.error ||
          `Unable to fetch states. Contact Admin / Check connection`,
      );
    } finally {
      setStatLoading(false);
    }
  };

  return (
    <Modal
      header={incident_id || " "}
      footer={null}
      className=""
      open={open}
      maskClosable={false}
      closable={true}
      onCancel={cancel}
    >
      <form className="form" onSubmit={formik.handleSubmit}>
        {content}
        <fieldset className="user-form" disabled={formik.isSubmitting}>
          <div className="form-input col-span-2">
            <label htmlFor="state">State</label>
            <div className="select-div">
              <Select
                name="state"
                id="state"
                className="custom-select"
                loading={statLoading}
                placeholder="Select State"
                value={formik.values.state || null}
                onChange={(value) => {
                  formik.setFieldValue("state", value);
                  formik.setFieldTouched("state", true);
                }}
                onOpenChange={async (open) => {
                  if (open) await fetchState();
                }}
                options={states.map((state) => ({
                  value: state.id,
                  label: state.name,
                }))}
              />
              {formik.touched.state && formik.errors.state && (
                <span className="danger">{formik.errors.state}</span>
              )}
            </div>
          </div>
        </fieldset>
        <div className="form-button-div">
          <button type="submit" disabled={formik.isSubmitting}>
            Set State
            {formik.isSubmitting && <Loading />}
          </button>
        </div>
      </form>
    </Modal>
  );
}
