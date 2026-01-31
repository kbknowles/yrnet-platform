// filepath: frontend/lib/officerDisplay.js

export const ROLE_LABELS = {
  PRESIDENT: "President",
  VICE_PRESIDENT: "Vice President",
  SECOND_VICE_PRESIDENT: "2nd Vice President",
  SECRETARY: "Secretary",
  TREASURER: "Treasurer",
  POINTS_SECRETARY: "Points Secretary",

  NATIONAL_DIRECTOR: "National Director",
  STATE_DIRECTOR: "State Director",
  REGION_DIRECTOR: "Region Director",
  BOARD_MEMBER: "Board Member",

  STUDENT_PRESIDENT: "President",
  STUDENT_VICE_PRESIDENT: "Vice President",
  STUDENT_SECRETARY: "Secretary",
  QUEEN: "Queen",
  JH_PRINCESS: "JH Princess",
};

export function publicEmailForRole(role) {
  if (!role) return null;
  return `${role.toLowerCase()}@ahsra.org`;
}

export function maskPhone(phone) {
  if (!phone || phone.length < 10) return null;
  return `(${phone.slice(0,3)}) •••-••${phone.slice(-2)}`;
}
