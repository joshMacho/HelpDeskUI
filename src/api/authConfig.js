export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,

    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`,

    redirectUri: `${window.location.origin}/prop/redirect.html`,

    postLogoutRedirectUri: `${window.location.origin}/prop/login`,

    navigateToLoginRequestUrl: false,
  },

  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

export const apiRequest = {
  scopes: [`api://${import.meta.env.VITE_MICROSOFT_CLIENT_ID}/access_as_user`],
};
