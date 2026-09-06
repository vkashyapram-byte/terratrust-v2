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

export const ROLE_PROFILES: Record<Role, ProfileDetails & { roleLabel: string }> = {
  citizen: {
    roleLabel: "Citizen",
    name: "Ananya Sharma",
    email: "ananya@terratrust.ai",
    region: "Bengaluru, India",
    phone: "+91 98765 43210",
    bio: "Owner of family properties in Bengaluru and Pune. Active in community verification.",
  },
  surveyor: {
    roleLabel: "Surveyor",
    name: "Rohan Verma",
    email: "rohan@surveyor.in",
    region: "Pune, India",
    phone: "+91 98765 43211",
    bio: "Licensed Land Surveyor with 10+ years experience in drone photogrammetry and boundary audits.",
  },
  officer: {
    roleLabel: "Gov. Officer",
    name: "Kavya Patel",
    email: "kavya@delhi.gov.in",
    region: "New Delhi, India",
    phone: "+91 98765 43212",
    bio: "Senior Land Revenue Officer managing digital registry & title authentication.",
  },
  admin: {
    roleLabel: "Administrator",
    name: "System Admin",
    email: "admin@terratrust.ai",
    region: "HQ, India",
    phone: "+91 98765 43215",
    bio: "TerraTrust AI system administrator with full governance and security permissions.",
  },
  verifier: {
    roleLabel: "Verifier",
    name: "Tara Sen",
    email: "tara@verify.community",
    region: "Mumbai, India",
    phone: "+91 98765 43213",
    bio: "Certified Community Verifier validating title deeds & field reports.",
  },
  bank: {
    roleLabel: "Bank",
    name: "Access Bank Ops",
    email: "ops@accessbank.com",
    region: "Financial District, India",
    phone: "+91 98765 43214",
    bio: "Mortgage risk analyst evaluating property valuation & collateral trust scores.",
  },
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
  profile: ROLE_PROFILES.citizen,
  updateProfile: () => undefined,
});

export function AccessControlProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("citizen");
  const [profile, setProfile] = useState<ProfileDetails>(ROLE_PROFILES.citizen);

  useEffect(() => {
    const savedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (savedRole && isRole(savedRole)) {
      setRoleState(savedRole);
      setProfile(ROLE_PROFILES[savedRole]);
    }
  }, []);

  const setRole = (nextRole: Role) => {
    setRoleState(nextRole);
    setProfile(ROLE_PROFILES[nextRole]);
    window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  };

  const signOut = () => {
    setRoleState("citizen");
    setProfile(ROLE_PROFILES.citizen);
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
