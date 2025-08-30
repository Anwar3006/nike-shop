export const ToastID = {
  REGISTER_ERROR: "register-error",
  LOGIN_ERROR: "login-error",
  REGISTER_SUCCESS: "register-success",
  LOGIN_SUCCESS: "login-success",
  LOGOUT_SUCCESS: "logout-success",
  SYSTEM_ERROR: "system-error",
};

export interface Address {
  id: string;
  type: "Home" | "Work" | "Other"; // Home
  streetAddress: string; // 1600 Amphitheatre Parkway
  city: string; //San Francisco
  state: string; //CA
  zipCode: string; //CA 94103
  phoneNumber: string; //+1 234 567 890
}
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  addresses: Address[];
}
