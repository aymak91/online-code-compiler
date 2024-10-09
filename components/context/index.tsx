import React, {  useState, useEffect, useContext, ReactNode } from "react";
import { auth, User } from "../../config/firestore";
import { onAuthStateChanged } from "firebase/auth"; //need firebase stuff

interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    loading: boolean;
  }

  const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

  export function useAuth(): AuthContextType | undefined {
    return useContext(AuthContext);
  }

  interface AuthProviderProps {
    children: ReactNode;
  }

  export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, initializeUser);
      return unsubscribe;
    }, []);

    async function initializeUser(user: User | null): Promise<void> {
      if (user) {
        setCurrentUser({ ...user });
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    }

    const value: AuthContextType = {
      currentUser,
      userLoggedIn,
      loading,
    };

    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }
