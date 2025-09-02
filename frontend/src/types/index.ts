export const ToastID = {
  REGISTER_ERROR: "register-error",
  LOGIN_ERROR: "login-error",
  REGISTER_SUCCESS: "register-success",
  LOGIN_SUCCESS: "login-success",
  LOGOUT_SUCCESS: "logout-success",
  LOGOUT_ERROR: "logout-error",

  ADD_FAVORITE_SUCCESS: "add-favorite-success",
  ADD_FAVORITE_ERROR: "add-favorite-error",
  REMOVE_FAVORITE_SUCCESS: "remove-favorite-success",
  REMOVE_FAVORITE_ERROR: "remove-favorite-error",
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
