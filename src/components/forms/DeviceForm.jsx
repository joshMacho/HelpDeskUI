import { DatePicker, message, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../ui/Loading";
import api from "../../api";
import { toast } from "react-toastify";
import { deviceValidation } from "../../configurations/formValidation";
import { addDeviceAsync, updateDeviceAsync } from "../../redux/deviceSlice";
import dayjs from "dayjs";

export default function DeviceForm({ isEdit, info, onSuccess }) {
  const user = useSelector((state) => state.credentials.user);
  const [messageApi, content] = message.useMessage();

  // redux selectors
  const deviceMake = useSelector((state) => state.deviceMake);
  const deviceType = useSelector((state) => state.deviceTypes);
  const dispatch = useDispatch();

  // useStates
  const [storageTypes, setStorageTypes] = useState([]);
  const [storageLoading, setStorageLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState([]);
  const [deviceStatusLoading, setDeviceStatusLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: isEdit ? info?.type : "",
      make: isEdit ? info?.make : "",
      model: isEdit ? info?.model : "",
      sn: isEdit ? info?.sn : "",
      os: isEdit ? info?.os : "Windows 11",
      cpu: isEdit ? info?.cpu : "",
      ramSize: isEdit ? info?.ramSize : "",
      storageType: isEdit ? info?.storageType : "",
      storageSize: isEdit ? info?.storageSize : "",
      ipAddress: isEdit ? info?.ipAddress : "",
      lifeCycleState: isEdit ? info?.lifeCycleState : "",
      datePurchased: isEdit ? dayjs(info?.datePurchased) : "",
      price: isEdit ? info?.price : "",
      location: isEdit ? info?.location : "",
    },
    validationSchema: deviceValidation,
    onSubmit: async (values, { resetForm }) => {
      isEdit
        ? submitUpdate(values, resetForm)
        : submitForm({ ...values, user_id: user.user_id }, resetForm);
    },
  });

  useEffect(() => {
    fetchBranches();
    fetchDeviceStatus();
    fetchStorageTypes;
  }, []);

  const submitForm = async (values, resetForm) => {
    // done something
    console.log("submitting...");
    console.log(values);
    dispatch(addDeviceAsync(values))
      .unwrap()
      .then((response) => {
        if (response.success) {
          toast.success(response?.message || "Device Successfully added");
          resetForm();
        } else {
          toast.error(response?.error || `Error adding device. Contact admin`);
        }
      })
      .catch((error) => {
        messageApi.error(error.error);
        console.log(error);
      });
  };

  const submitUpdate = async (values, resetForm) => {
    // do something
    console.log("updating...");
    dispatch(updateDeviceAsync({ id: info.device_id, values }))
      .unwrap()
      .then((response) => {
        toast.success(response?.message || `Successfully updated device`);
        resetForm();
        onSuccess();
      })
      .catch((error) => {
        messageApi.error(error.error);
        console.log(error);
      });
  };

  // fetch storage types
  const fetchStorageTypes = async () => {
    setStorageLoading(true);
    try {
      const response = await api.get("/getstoragetypes");
      if (!response.data.success)
        messageApi.error(
          response.data?.error || `Error fetching storag types. Contact admin`,
        );
      setStorageLoading(false);
      return setStorageTypes(response.data.data);
    } catch (error) {
      toast.error(
        error.response.data.error ||
          `Error from reaching server (storage types), contact admin`,
      );
      console.log(error);
      setStorageLoading(false);
    }
  };

  // fetch all branches
  const fetchBranches = async () => {
    setBranchLoading(true);
    try {
      const response = await api.get("/getbranches");
      if (!response.data.success)
        messageApi.error(
          response.data?.error || `Error fetching storag types. Contact admin`,
        );
      setBranchLoading(false);
      return setBranches(response.data.data);
    } catch (error) {
      toast.error(
        error.response.data.error ||
          `Error from reaching server (storage types), contact admin`,
      );
      console.log(error);
      setBranchLoading(false);
    }
  };

  // fetch all branches
  const fetchDeviceStatus = async () => {
    setDeviceStatusLoading(true);
    try {
      const response = await api.get("/getdevicestatus");
      if (!response.data.success)
        messageApi.error(
          response.data?.error || `Error fetching device status. Contact admin`,
        );
      setDeviceStatusLoading(false);
      return setDeviceStatus(response.data.data);
    } catch (error) {
      toast.error(
        error.response.data.error ||
          `Error from reaching server (device status), contact admin`,
      );
      console.log(error);
      setDeviceStatusLoading(false);
    }
  };

  // data source for select
  const makeDataSource = (
    Array.isArray(deviceMake.data) && deviceMake.data.length > 0
      ? deviceMake.data
      : []
  ).map((make) => ({
    value: make.make_id,
    label: make.name,
  }));

  const typeDataSource = (
    Array.isArray(deviceType.data) && deviceType.data.length > 0
      ? deviceType.data
      : []
  ).map((type) => ({
    value: type.type_id,
    label: type.name,
  }));

  return (
    <form onSubmit={formik.handleSubmit} method="POST" className="form">
      {content}
      <fieldset className="user-form" disabled={formik.isSubmitting}>
        <div className="form-input col-span-2">
          <label htmlFor="type">Select Type</label>
          <div className="select-div">
            <Select
              id="type"
              name="type"
              className="custom-select"
              variant="borderless"
              placeholder="Select type"
              options={typeDataSource}
              onChange={(value) => {
                formik.setFieldValue("type", value);
                formik.setFieldTouched("type", true);
              }}
              onBlur={() => formik.setFieldTouched("type", true)}
              value={formik.values.type || null}
            />
            {formik.touched.type && formik.errors.type && (
              <span className="danger">{formik.errors.type}</span>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="make">Select Make</label>
          <div className="select-div">
            <Select
              name="make"
              id="make"
              className="custom-select"
              variant="borderless"
              placeholder="Select make"
              options={makeDataSource}
              onChange={(value) => {
                formik.setFieldValue("make", value);
                formik.setFieldTouched("make", true);
              }}
              onBlur={() => formik.setFieldTouched("make", true)}
              value={formik.values.make || null}
            />
            {formik.touched.make && formik.errors.make && (
              <span className="danger">{formik.errors.make}</span>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="model">Device Model</label>
          <div className="input-div">
            <input
              type="text"
              name="model"
              id="model"
              placeholder="Model"
              value={formik.values.model}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.model && formik.errors.model && (
              <small className="danger">{formik.errors.model}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="sn">Serial Number</label>
          <div className="input-div">
            <input
              type="text"
              name="sn"
              id="sn"
              placeholder="Serial Number"
              value={formik.values.sn}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.sn && formik.errors.sn && (
              <small className="danger">{formik.errors.sn}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="cpu">Processor</label>
          <div className="input-div">
            <input
              type="text"
              name="cpu"
              id="cpu"
              placeholder="Processor details..."
              value={formik.values.cpu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.cpu && formik.errors.cpu && (
              <small className="danger">{formik.errors.cpu}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="os">Operating System</label>
          <div className="input-div">
            <input
              type="text"
              name="os"
              id="os"
              placeholder="OS"
              value={formik.values.os}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.os && formik.errors.os && (
              <small className="danger">{formik.errors.os}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="ramSize">RAM Size</label>
          <div className="input-div">
            <input
              type="text"
              name="ramSize"
              id="ramSize"
              placeholder="Ram size eg. 2,4,816..."
              value={formik.values.ramSize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ramSize && formik.errors.ramSize && (
              <small className="danger">{formik.errors.ramSize}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="storageType">Select Storage Type</label>
          <div className="select-div">
            <Select
              id="storageType"
              name="storageType"
              className="custom-select"
              variant="borderless"
              placeholder="Select storage type"
              onChange={(value) => {
                formik.setFieldValue("storageType", value);
                formik.setFieldTouched("storageType", true);
              }}
              onBlur={() => formik.setFieldTouched("storageType", true)}
              value={formik.values.storageType || null}
              loading={storageLoading}
              onOpenChange={(visible) => {
                if (visible) {
                  fetchStorageTypes();
                }
              }}
              options={storageTypes.map((type) => ({
                value: type.storage_id,
                label: type.name,
              }))}
            />
            {formik.touched.storageType && formik.errors.storageType && (
              <span className="danger">{formik.errors.storageType}</span>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="storageSize">Storage Size</label>
          <div className="input-div">
            <input
              type="text"
              name="storageSize"
              id="storageSize"
              placeholder="eg. 256GB, 1TB, 512GB..."
              value={formik.values.storageSize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.storageSize && formik.errors.storageSize && (
              <small className="danger">{formik.errors.storageSize}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="ipAddress">IP Address</label>
          <div className="input-div">
            <input
              type="text"
              name="ipAddress"
              id="ipAddress"
              placeholder="eg... 192.168.34.39"
              value={formik.values.ipAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ipAddress && formik.errors.ipAddress && (
              <small className="danger">{formik.errors.ipAddress}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="datePurchased">Date Purchased</label>
          <div className="select-div">
            <DatePicker
              picker="date"
              name="datePurchased"
              id="datePurchased"
              value={formik.values.datePurchased}
              onChange={(date) => {
                formik.setFieldValue("datePurchased", date);
                formik.setFieldTouched("datePurchased", true);
              }}
              onBlur={() => formik.setFieldTouched(true)}
              className="custom-datepicker"
            />
            {formik.touched.datePurchased && formik.errors.datePurchased && (
              <span className="danger">{formik.errors.datePurchased}</span>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="price">Price</label>
          <div className="input-div">
            <input
              type="text"
              name="price"
              id="price"
              placeholder="...1000.00"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <small className="danger">{formik.errors.price}</small>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="location">Select Location</label>
          <div className="select-div">
            <Select
              id="location"
              name="location"
              className="custom-select"
              variant="borderless"
              placeholder="Select location"
              onChange={(value) => {
                formik.setFieldValue("location", value);
                formik.setFieldTouched("location", true);
              }}
              onBlur={() => formik.setFieldTouched("location", true)}
              value={formik.values.location || null}
              onOpenChange={(visible) => {
                if (visible) fetchBranches();
              }}
              options={branches.map((branch) => ({
                value: branch.branch_id,
                label: branch.name,
              }))}
              loading={branchLoading}
            />
            {formik.touched.location && formik.errors.location && (
              <span className="danger">{formik.errors.location}</span>
            )}
          </div>
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="lifeCycleState">Select Status</label>
          <div className="select-div">
            <Select
              id="lifeCycleState"
              name="lifeCycleState"
              className="custom-select"
              variant="borderless"
              placeholder="Select location"
              loading={deviceStatusLoading}
              value={formik.values.lifeCycleState || null}
              onChange={(value) => {
                formik.setFieldValue("lifeCycleState", value);
                formik.setFieldTouched("lifeCycleState", true);
              }}
              onBlur={() => formik.setFieldTouched("lifeCycleState", true)}
              onOpenChange={(visible) => {
                if (visible) fetchDeviceStatus();
              }}
              options={deviceStatus.map((status) => ({
                value: status.status_id,
                label: status.name,
              }))}
            />
            {formik.touched.lifeCycleState && formik.errors.lifeCycleState && (
              <span className="danger">{formik.errors.lifeCycleState}</span>
            )}
          </div>
        </div>
      </fieldset>
      <div className="form-button-div">
        <button type="submit" disabled={formik.isSubmitting}>
          {isEdit ? "Update" : "Save"}
          {formik.isSubmitting ? <Loading /> : ""}
        </button>
      </div>
    </form>
  );
}
