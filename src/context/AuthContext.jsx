/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { clearStoredUser, getStoredUser, storeUser } from "../utils/storage.js";
import { loginAdmin, loginPelanggan, registerPelanggan } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const persistUser = useCallback((nextUser) => {
    storeUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signInAdmin = useCallback(async (credentials) => persistUser(await loginAdmin(credentials)), [persistUser]);
  const signInPelanggan = useCallback(async (credentials) => persistUser(await loginPelanggan(credentials)), [persistUser]);
  const signUpPelanggan = useCallback(async (payload) => persistUser(await registerPelanggan(payload)), [persistUser]);

  const updateUser = useCallback((patch) => {
    if (!user) return null;
    return persistUser({ ...user, ...patch });
  }, [persistUser, user]);

  const logout = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isPelanggan: user?.role === "pelanggan",
      login: signInAdmin,
      loginAdmin: signInAdmin,
      loginPelanggan: signInPelanggan,
      registerPelanggan: signUpPelanggan,
      updateUser,
      logout
    }),
    [logout, signInAdmin, signInPelanggan, signUpPelanggan, updateUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  return context;
}
