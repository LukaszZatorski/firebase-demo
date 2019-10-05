import React from 'react';

export type AuthUser = {
  uid: string;
  email: string;
  roles: { [string_key: string]: string };
};

const AuthUserContext = React.createContext<AuthUser | null>(null);

export default AuthUserContext;
