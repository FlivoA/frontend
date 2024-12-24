import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "54640c7c-9944-422a-80a9-e7a6c513e06d", // Your Azure AD app client ID
    authority: "https://login.microsoftonline.com/common", // Authority URL
    redirectUri:  "https://flivoai-d1448.web.app", // Dynamic redirect URI
  },
cache: {
  cacheLocation: "sessionStorage", // Store the session in sessionStorage or localStorage
  storeAuthStateInCookie: true, // Set to true for better IE11 support
},
};

// Create and export the MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

