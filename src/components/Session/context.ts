import React from 'react';
import app from 'firebase/app';

export type AuthUser = {
  uid: string;
  email: string;
  emailVerified: boolean;
  providerData: app.UserInfo[];
  roles: { [string_key: string]: string };
};

const AuthUserContext = React.createContext<AuthUser | null>(null);

export default AuthUserContext;
