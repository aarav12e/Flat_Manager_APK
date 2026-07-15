// This file seeds a local, on-device "database" using AsyncStorage so the app
// is fully usable inside Expo Go right now. Every function in api.js is written
// so that later, swapping the body for a real `fetch(BASE_URL + ...)` call is
// the only change needed — screens never talk to AsyncStorage directly.

export const SEED = {
  users: [
    {
      id: "u-admin",
      role: "admin",
      name: "Society Admin",
      phone: "9999900000",
      password: "admin123",
      flatId: null,
    },
    {
      id: "u1",
      role: "owner",
      name: "Rakesh Mehra",
      phone: "9876500001",
      password: "pass123",
      flatId: "f101",
    },
    {
      id: "u2",
      role: "owner",
      name: "Sunita Iyer",
      phone: "9876500002",
      password: "pass123",
      flatId: "f102",
    },
    {
      id: "u3",
      role: "owner",
      name: "Farhan Sheikh",
      phone: "9876500003",
      password: "pass123",
      flatId: "f201",
    },
  ],
  flats: [
    {
      id: "f101",
      number: "A-101",
      ownerId: "u1",
      ownerName: "Rakesh Mehra",
      phone: "9876500001",
      listingStatus: "none", // "none" | "rent" | "sale"
      details: "",
    },
    {
      id: "f102",
      number: "A-102",
      ownerId: "u2",
      ownerName: "Sunita Iyer",
      phone: "9876500002",
      listingStatus: "rent",
      details: "2BHK, semi-furnished, available from next month.",
    },
    {
      id: "f201",
      number: "B-201",
      ownerId: "u3",
      ownerName: "Farhan Sheikh",
      phone: "9876500003",
      listingStatus: "sale",
      details: "3BHK, east-facing, ready to move.",
    },
  ],
  notices: [
    {
      id: "n1",
      title: "Water supply maintenance",
      body: "Water will be shut off on Sunday 9am-1pm for tank cleaning.",
      audience: "all",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: "n2",
      title: "Maintenance bill reminder",
      body: "Please clear pending maintenance dues by the 5th.",
      audience: "f102",
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
  ],
  issues: [
    {
      id: "i1",
      flatId: "f102",
      flatNumber: "A-102",
      raisedBy: "Sunita Iyer",
      title: "Leaking tap in kitchen",
      description: "The kitchen tap has been leaking for two days.",
      status: "open", // "open" | "resolved"
      createdAt: Date.now() - 1000 * 60 * 60 * 30,
    },
  ],
  suggestions: [
    {
      id: "s1",
      flatId: "f201",
      flatNumber: "B-201",
      raisedBy: "Farhan Sheikh",
      message: "Can we add a CCTV camera near the main gate?",
      createdAt: Date.now() - 1000 * 60 * 60 * 50,
    },
  ],
};
