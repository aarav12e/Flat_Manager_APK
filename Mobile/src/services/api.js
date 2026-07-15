import AsyncStorage from "@react-native-async-storage/async-storage";

// -----------------------------------------------------------------------
// Node.js backend integration URL. Uses the local network IP to support
// both simulated and physical devices on the local Wi-Fi.
// -----------------------------------------------------------------------
export const BASE_URL = "http://10.70.196.83:5001/api";

const SESSION_KEY = "nestlist_session_v1";
const TOKEN_KEY = "nestlist_token_v1";

// Helper to normalize MongoDB responses (map _id -> id, dates to timestamps)
// to maintain backward compatibility with screens expecting mock DB shapes.
function normalize(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(normalize);
  }
  if (typeof obj === "object") {
    const newObj = { ...obj };
    if (newObj._id && !newObj.id) {
      newObj.id = newObj._id;
    }
    if (newObj.createdAt && typeof newObj.createdAt === "string") {
      newObj.createdAt = new Date(newObj.createdAt).getTime();
    }
    if (newObj.updatedAt && typeof newObj.updatedAt === "string") {
      newObj.updatedAt = new Date(newObj.updatedAt).getTime();
    }
    return newObj;
  }
  return obj;
}

// Retrieves authorization headers with JWT token if available.
async function getHeaders() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Common request wrapper
async function request(endpoint, options = {}) {
  const headers = await getHeaders();
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return normalize(data);
}

// ---------------- AUTH ----------------

export async function login(phone, password) {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
  // Response is: { token, user: { id, name, phone, role, flatId } }
  await AsyncStorage.setItem(TOKEN_KEY, res.token);
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
  return res.user;
}

export async function register({ name, phone, password, flatNumber }) {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, phone, password, flatNumber }),
  });
  // Response is: { token, user: { id, name, phone, role, flatId } }
  await AsyncStorage.setItem(TOKEN_KEY, res.token);
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
  return res.user;
}

export async function getSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ---------------- FLATS ----------------

export async function getMyFlat(userId) {
  return request("/flats/me");
}

export async function updateMyFlat(flatId, updates) {
  return request("/flats/me", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function getDirectory(excludeFlatId) {
  return request("/flats/directory");
}

export async function getAllFlats() {
  return request("/flats");
}

// ---------------- NOTICES ----------------

export async function getNotices(flatId) {
  return request("/notices");
}

export async function getAllNotices() {
  return request("/notices/all");
}

export async function sendNotice({ title, body, audience }) {
  return request("/notices", {
    method: "POST",
    body: JSON.stringify({ title, body, audience }),
  });
}

// ---------------- ISSUES (reported by owners, seen by admin) ----------------

export async function reportIssue({ flatId, flatNumber, raisedBy, title, description }) {
  return request("/issues", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

export async function getAllIssues() {
  return request("/issues");
}

export async function getMyIssues(flatId) {
  return request("/issues/mine");
}

export async function setIssueStatus(issueId, status) {
  return request(`/issues/${issueId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---------------- SUGGESTIONS ----------------

export async function sendSuggestion({ flatId, flatNumber, raisedBy, message }) {
  return request("/suggestions", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getAllSuggestions() {
  return request("/suggestions");
}

export async function savePushToken(pushToken) {
  return request("/auth/push-token", {
    method: "POST",
    body: JSON.stringify({ pushToken }),
  });
}
