import { Descriptions, Modal, Select, Space, Switch } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { useFormik } from "formik";
import { permissionValidation } from "../../configurations/formValidation";
import { getRoles } from "../../data";
import { useState } from "react";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import Loading from "../ui/Loading";
import api from "../../api";
import { toast } from "react-toastify";

export default function MigrateViewModal({
  open,
  onClose,
  info,
  isEdit,
  onSuccess,
}) {
  const [roles, setRoles] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
      role: "",
      add_right: isEdit ? info.add_right : true,
      update_right: isEdit ? info.update_right : true,
      delete_right: isEdit ? info.delete_right : false,
      retrieve: isEdit ? info.retrieve : false,
      assign: isEdit ? info.assign : false,
    },
    validationSchema: permissionValidation,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      if (isEdit) {
        submitUpdate(values, resetForm);
      } else {
        submitForm(
          { user_id: info.user_id, ...values },
          resetForm,
          setSubmitting
        );
      }
    },
  });

  // submit form
  const submitForm = async (values, resetForm, setSubmitting) => {
    // submit form
    try {
      const response = await api.post(`/migrateuser`, values);
      if (!response.data.success) {
        setSubmitting(false);
        return messageApi.error(
          response?.data?.error || `Error adding user account`
        );
      }
      setSubmitting(false);
      onSuccess();
      resetForm();
      return toast.success(
        response.data?.message || `Successfully migrated user`
      );
    } catch (error) {
      setSubmitting(false);
      return toast.error(
        error.response.data.error ||
          `Error migrating user. Check connection / contact admin`
      );
    }
  };

  // submit update
  const submitUpdate = async () => {
    // submit update
  };

  // fetch roles
  const fetchRoles = async () => {
    try {
      const result = await getRoles();
      setRoles(result || []);
    } catch (error) {
      console.log(`fetch roles error: `, error);
      return toast.error(error.message);
    }
  };

  return (
    <Modal
      header={null}
      closable={true}
      open={open}
      onCancel={onClose}
      footer={null}
      className=""
      width={"auto"}
    >
      <Descriptions title={`Migrate ${info.fullName}`} bordered column={2}>
        <DescriptionsItem label="Username">{info.username}</DescriptionsItem>
        <DescriptionsItem label="Email">{info.email}</DescriptionsItem>
        <DescriptionsItem label="Location">{info.location}</DescriptionsItem>
        <DescriptionsItem label="Department">
          {info.department}
        </DescriptionsItem>
      </Descriptions>

      <div className="migrate-form-div">
        <form className="form" method="POST" onSubmit={formik.handleSubmit}>
          <fieldset className="user-form" disabled={formik.isSubmitting}>
            <div className="form-input col-span-1">
              <label htmlFor="password">Password</label>
              <div className="input-div">
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <small className="danger">{formik.errors.password}</small>
                )}
              </div>
            </div>
            <div className="form-input col-span-1">
              <label htmlFor="confirmPassword">Confirm</label>
              <div className="input-div">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Enter password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <small className="danger">
                      {formik.errors.confirmPassword}
                    </small>
                  )}
              </div>
            </div>
            <div className="form-input col-span-2">
              <label htmlFor="role">User Role</label>
              <div className="select-div">
                <Select
                  name="role"
                  id="role"
                  className="custom-select"
                  placeholder="Select make"
                  onSelect={(value) => {
                    formik.setFieldValue("role", value);
                    formik.setFieldTouched("role", true);
                  }}
                  value={formik.values.role || null}
                  onOpenChange={(visible) => {
                    if (visible) fetchRoles();
                  }}
                  options={roles.map((item) => ({
                    value: item.id,
                    label: item.role.toUpperCase(),
                  }))}
                />
                {formik.touched.role && formik.errors.role && (
                  <span className="danger">{formik.errors.role}</span>
                )}
              </div>
            </div>
            <Space horizontal="true">
              <div>
                <p>Add</p>
                <Switch
                  checked={Boolean(formik.values.add_right)}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={(checked) => {
                    formik.setFieldValue("add_right", checked);
                    formik.setFieldTouched("add_right", true);
                  }}
                />
              </div>
              <div>
                <p>Update</p>
                <Switch
                  checked={Boolean(formik.values.update_right)}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={(checked) => {
                    formik.setFieldValue("update_right", checked);
                    formik.setFieldTouched("update_right", true);
                  }}
                />
              </div>
              <div>
                <p>Delete</p>
                <Switch
                  checked={formik.values.delete_right}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={(checked) => {
                    formik.setFieldValue("delete_right", checked);
                    formik.setFieldTouched("delete_right", true);
                  }}
                />
              </div>
              <div>
                <p>Retrieve</p>
                <Switch
                  checked={formik.values.retrieve}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={(checked) => {
                    formik.setFieldValue("retrieve", checked);
                    formik.setFieldTouched("retrieve", true);
                  }}
                />
              </div>
              <div>
                <p>Assign</p>
                <Switch
                  checked={formik.values.assign}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={(checked) => {
                    formik.setFieldValue("assign", checked);
                    formik.setFieldTouched("assign", true);
                  }}
                />
              </div>
            </Space>
          </fieldset>
          <div className="form-button-div">
            <button type="submit" disabled={formik.isSubmitting}>
              {isEdit ? "Migrating..." : "Migrate"}
              {formik.isSubmitting ? <Loading /> : ""}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
