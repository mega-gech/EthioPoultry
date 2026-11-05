import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  location?: string;
  phone?: string;
};


type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 
    const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/me",
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      setUser(null);
      return null;
    }

    const data = await response.json();
    const currentUser: AuthUser | null = data.user ?? null;

    setUser(currentUser);

    return currentUser;
  } catch {
    setUser(null);
    return null;
  }
}, []);

 

  useEffect(() => {
  const loadCurrentUser = async () => {
    try {
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  loadCurrentUser();
}, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
