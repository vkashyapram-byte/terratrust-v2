// Quick verification script — tests the access matrix logic
import { canAccessNavItem, NAV_ACCESS } from "../src/lib/navAccessConfig.ts";

type Role = "citizen" | "surveyor" | "officer" | "verifier" | "admin" | "bank";

const ROLES: Role[] = ["citizen", "surveyor", "officer", "verifier", "bank", "admin"];

// Expected access matrix from the user's requirements
const EXPECTED: Record<string, Role[]> = {
  "/dashboard":    ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/properties":   ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/map":          ["citizen", "surveyor", "officer", "admin"],
  "/valuation":    ["citizen", "officer", "bank", "admin"],
  "/assistant":    ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/search":       ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/ai":           ["officer", "admin"],
  "/ai-passport":  ["citizen", "surveyor", "officer", "verifier", "bank", "admin"],
  "/ai-valuation": ["bank", "admin"],
  "/ai-ocr":       ["surveyor", "officer", "verifier", "admin"],
  "/ai-fraud":     ["officer", "bank", "admin"],
  "/ai-risk":      ["officer", "bank", "admin"],
  "/ai-confidence":["citizen", "officer", "verifier", "bank", "admin"],
};

let failures = 0;
let passes = 0;

for (const [path, allowedRoles] of Object.entries(EXPECTED)) {
  for (const role of ROLES) {
    const expected = allowedRoles.includes(role);
    const actual = canAccessNavItem(role, path);
    if (actual !== expected) {
      console.error(`FAIL: canAccessNavItem("${role}", "${path}") = ${actual}, expected ${expected}`);
      failures++;
    } else {
      passes++;
    }
  }
}

// Test unlisted paths (should be accessible to everyone)
const unlistedPaths = ["/ai-boundary", "/ai-timeline", "/verification", "/community", "/profile"];
for (const path of unlistedPaths) {
  for (const role of ROLES) {
    const actual = canAccessNavItem(role, path);
    if (!actual) {
      console.error(`FAIL: unlisted path "${path}" denied for role "${role}" — should be accessible to all`);
      failures++;
    } else {
      passes++;
    }
  }
}

console.log(`\n✅ ${passes} tests passed`);
if (failures > 0) {
  console.log(`❌ ${failures} tests FAILED`);
  process.exit(1);
} else {
  console.log("All access matrix tests passed!");
}
