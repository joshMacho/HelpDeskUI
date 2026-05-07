import * as Yup from "yup";

export const deviceTypeValidation = Yup.object({
  type: Yup.string().required("Device type is required"),
  description: Yup.string(),
});

export const deviceMakeValidation = Yup.object({
  name: Yup.string().required("Make is required"),
});

export const deviceValidation = Yup.object({
  type: Yup.string().required("Type is required"),
  make: Yup.string().required("Make is required"),
  sn: Yup.string().required("Serial number is required"),
  os: Yup.string(),
  cpu: Yup.string(),
  ramSize: Yup.number(),
  storageSize: Yup.string().matches(
    /^\d{1,3}(GB|TB)$/,
    "Entry should be 3 digits followed by GB or TB",
  ),
  ipAddress: Yup.string(),
  price: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a number up to 2 decimal places",
    )
    .test("is-greater-than-zero", (value) => {
      const numericValue = parseFloat(value);
      return numericValue > 0;
    }),
  location: Yup.string().required("Location is required"),
  lifeCycleState: Yup.string().required("State of device is required"),
});

export const userValidation = Yup.object({
  fullName: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  department: Yup.string().required("Department is required"),
  location: Yup.string().required("Location is required"),
});

export const permissionValidation = Yup.object({
  password: Yup.string(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match",
  ),
  role: Yup.string().required("role is required"),
  add_right: Yup.boolean(),
  update_right: Yup.boolean(),
  delete_right: Yup.boolean(),
  retrieve: Yup.boolean(),
  assign: Yup.boolean(),
});

export const assignDeviceValidation = Yup.object({
  assignee: Yup.string().required("User to be assigned is requeired"),
  assignedDevice: Yup.string().required("Device assigned is required"),
  date_assigned: Yup.mixed().required("select date assigned").nullable(false),
  comments: Yup.string(),
});

export const searchValidation = Yup.object({
  search: Yup.string()
    .trim()
    .min(2, "Search must be atleast 2 characters long")
    .required("Search is required"),
});

export const resetPasswordValidation = Yup.object({
  current: Yup.string()
    .required("Current password required")
    .min(8, "Old password cannot be less than 8"),
  password: Yup.string()
    .required("Enter a password")
    .min(8, "Password must atleast be 8 characters")
    .matches(/[a-z]/, "Password must contatin at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special letter (@$!%*?&#)",
    ),
  confirm: Yup.string().oneOf([Yup.ref("password")], "Password must match"),
});

export const resetEmailValidation = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required(`Email is required`),
});

export const licenseValidation = Yup.object({
  license_key: Yup.string().required("License key required"),
  name: Yup.string().required("License Name required"),
  license_number: Yup.number()
    .typeError("License number must be a number")
    .required("License number is required"),
  description: Yup.string(),
});

export const locationValidation = Yup.object({
  name: Yup.string().required("Location name is required"),
});

export const proposalLinkValidation = Yup.object({
  proposal: Yup.string().required(),
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Enter a valid email"),
  phone: Yup.string().matches(
    /^0[2-5]\d{8}/,
    "Number should start with 0,\nBe 10 digits eg. 054xxxxxxx",
  ),
});
