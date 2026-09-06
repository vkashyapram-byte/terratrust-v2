import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { currentUser } from "./mock-data";
import type { Role } from "./types";
import { canAccessNavItem } from "./navAccessConfig";

const ROLE_STORAGE_KEY = "terratrust.role";

const protectedAreas: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: "/surveyor", roles: ["surveyor"] },
  { prefix: "/government", roles: ["officer"] },
  { prefix: "/bank", roles: ["bank"] },
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/attestations", roles: ["citizen", "verifier"] },
];

export type ProfileDetails = {
  name: string;
  email: string;
  region: string;
  phone: string;
  bio: string;
};

const initialProfile: ProfileDetails = {
  name: currentUser.name,
  email: currentUser.email,
  region: currentUser.region ?? "",
  phone: "+234 803 555 0102",
  bio: "Owner of family properties in Bengaluru and Pune. Active in community verification.",
};

const roleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
  signOut: () => void;
  profile: ProfileDetails;
  updateProfile: (profile: ProfileDetails) => void;
}>({
  role: "citizen",
  setRole: () => undefined,
  signOut: () => undefined,
  profile: initialProfile,
  updateProfile: () => undefined,
});

export function AccessControlProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("citizen");
  const [profile, setProfile] = useState<ProfileDetails>(initialProfile);

  useEffect(() => {
    const savedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (savedRole && isRole(savedRole)) setRoleState(savedRole);
  }, []);

  const setRole = (nextRole: Role) => {
    setRoleState(nextRole);
    window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  };

  const signOut = () => {
    setRoleState("citizen");
    setProfile(initialProfile);
    window.localStorage.removeItem(ROLE_STORAGE_KEY);
  };

  return (
    <roleContext.Provider value={{ role, setRole, signOut, profile, updateProfile: setProfile }}>
      {children}
    </roleContext.Provider>
  );
}

export function useAccessControl() {
  return useContext(roleContext);
}

export function canAccessPath(role: Role, pathname: string) {
  if (role === "admin") return true;

  // Check role-specific workspace prefixes (existing logic)
  const area = protectedAreas.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (area && !area.roles.includes(role)) return false;

  // Check nav access matrix (new — covers AI pages, map, valuation, etc.)
  if (!canAccessNavItem(role, pathname)) return false;

  return true;
}

function isRole(value: string): value is Role {
  return ["citizen", "surveyor", "officer", "verifier", "admin", "bank"].includes(value);
}
