import { useFormik } from "formik";
import { assignDeviceValidation } from "../../configurations/formValidation";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { getDevices, getUsers } from "../../data";
import Loading from "../ui/Loading";
import { assignDeviceAsync } from "../../redux/assignDeviceSlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function AssignDeviceModal({ open, onClose, info, onSuccess }) {
  const user = useSelector((state) => state.credentials.user);
  const assignLoading = (state) => state.assignDevice.loading;
  const dispatch = useDispatch();

  const { TextArea } = Input;
  const [users, setUsers] = useState({
    data: [],
    loading: false,
  });
  const [devices, setDevices] = useState({
    data: [],
    loading: false,
  });

  const [messageApi, context] = message.useMessage();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      assignee: "",
      assignedDevice: info?.key || "",
      date_assigned: "",
      comments: "",
    },
    validationSchema: assignDeviceValidation,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      console.log(values);
      submitForm(
        { created_by: user.user_id, ...values },
        resetForm,
        setSubmitting,
      );
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const submitForm = async (values, resetForm, setSubmitting) => {
    try {
      const response = await dispatch(assignDeviceAsync(values)).unwrap();
      if (!response.success)
        return messageApi.error(
          response?.error || `Unable to assign device to user`,
        );
      resetForm();
      onSuccess();
      return toast.success(
        response?.message || `Device successfully assigned to user`,
      );
    } catch (error) {
      console.log("Error from assigning device: ", error);
      toast.error(
        error?.error ||
          "Error assigning device to user. Check connection / contact admin",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fetchUsers = async () => {
    setUsers((previous) => ({ ...previous, loading: true }));
    try {
      const usr = await getUsers();
      setUsers({ data: usr, loading: false });
    } catch (error) {
      console.log(`Error from getting users (assign form): `, error);
      setUsers((previous) => ({ ...previous, loading: false }));
      return messageApi.error(
        error.reponse?.data?.error || `Error loading users`,
      );
    }
  };

  const fetchDevices = async () => {
    setDevices((previous) => ({ ...previous, loading: true }));
    try {
      const dev = await getDevices();
      setDevices({ data: dev, loading: false });
    } catch (error) {
      console.log(`Error from getting devices (assign form): `, error);
      setUsers((previous) => ({ ...previous, loading: false }));
      return messageApi.error(
        error.reponse?.data?.error || `Error loading devices`,
      );
    }
  };

  return (
    <Modal
      header={`Device header`}
      closable={true}
      open={open}
      onCancel={onClose}
      footer={null}
      className=""
      width={"auto"}
    >
      <form className="form" method="POST" onSubmit={formik.handleSubmit}>
        {context}
        <fieldset className="user-form" disabled={formik.isSubmitting}>
          <div className="form-input col-span-2">
            <label htmlFor="assignedDevice">Device</label>
            <div className="select-div">
              <Select
                id="assignedDevice"
                name="assignedDevice"
                className="custom-select"
                variant="borderless"
                showSearch
                placeholder="Search or Select"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                value={formik.values.assignedDevice || null}
                loading={devices.loading}
                onChange={(value) => {
                  formik.setFieldValue("assignedDevice", value);
                  formik.validateField("assignedDevice");
                }}
                onOpenChange={(visible) => {
                  if (visible) fetchDevices();
                }}
                options={devices.data.map((device) => ({
                  value: device.device_id,
                  label: `${device.make} ${device.model} (${device.sn})`,
                }))}
              />
              {formik.touched.assignedDevice &&
                formik.errors.assignedDevice && (
                  <span className="danger">{formik.errors.assignedDevice}</span>
                )}
            </div>
          </div>
          <div className="form-input col-span-1">
            <label htmlFor="assignee">Assign</label>
            <div className="select-div">
              <Select
                id="assignee"
                name="assignee"
                className="custom-select"
                variant="borderless"
                showSearch
                placeholder="Search or Select"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                value={formik.values.assignee || null}
                loading={users.loading}
                onChange={(value) => {
                  formik.setFieldValue("assignee", value);
                  formik.validateField("assignee");
                }}
                onOpenChange={(visible) => {
                  if (visible) fetchUsers();
                }}
                options={users.data.map((user) => ({
                  value: user.user_id,
                  label: user.fullName,
                }))}
              />
              {formik.touched.assignee && formik.errors.assignee && (
                <span className="danger">{formik.errors.assignee}</span>
              )}
            </div>
          </div>
          <div className="form-input col-span-1">
            <label htmlFor="date_assigned">Date Assigned</label>
            <div className="select-div">
              <DatePicker
                picker="date"
                name="date_assigned"
                id="date_assigned"
                value={formik.values.date_assigned}
                onCalendarChange={(date) => {
                  // const now = dayjs();
                  // const dateWithTime = date
                  //   .hour(now.hour())
                  //   .minute(now.minute())
                  //   .second(now.second());
                  formik.setFieldValue("date_assigned", date);
                  formik.setFieldTouched("date_assigned", true);
                  formik.validateField("date_assigned");
                }}
                onBlur={() => formik.setFieldTouched("date_assigned", true)}
                className="custom-datepicker"
              />
              {formik.touched.date_assigned && formik.errors.date_assigned && (
                <span className="danger">{formik.errors.date_assigned}</span>
              )}
            </div>
          </div>
          <div className="form-input col-span-2">
            <label htmlFor="comments">Comments</label>
            <div className="input-div">
              <TextArea
                id="comments"
                name="comments"
                rows={4}
                placeholder="Comments on current state..."
                maxLength={100}
                value={formik.values.comments}
                count={{ show: true, max: 100 }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="custom-textarea"
              />
              {formik.touched.comments && formik.errors.comments && (
                <span className="comments">{formik.errors.comments}</span>
              )}
            </div>
          </div>
        </fieldset>
        <div className="form-button-div">
          <button type="submit" disabled={formik.isSubmitting}>
            Assign
            {formik.isSubmitting ? <Loading /> : ""}
          </button>
        </div>
      </form>
    </Modal>
  );
}
