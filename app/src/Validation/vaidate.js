//*============= >>>    Some globally used function     <<< ===============//


// >>>> to check that object has keys or not 
export const checkEmptyBody = (object) => {
  return Object.keys(object).length > 0
};                                  

// Validating that the Input must be a non-empty String
export const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

// Name Validation
export const isValidName = (name) => { return ((/^[a-zA-Z ]+$/).test(name)); };

// Validation for Phone No. (10 digits only)
export const isValidPhone = (phone) => { return ((/^[6789][0-9]{9}$/g).test(phone)); };

// Validation for Email
export const isValidEmail = (email) => { return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email); };