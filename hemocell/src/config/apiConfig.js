// API Configuration
export const API_BASE_URL = 'http://localhost:3001/api';

export const ENDPOINTS = {
  DASHBOARD: 'dashboard',
  DONATE_BLOOD: 'donate-blood',
  NEED_BLOOD: 'need-blood',
  HOST_BLOOD_DRIVE: 'host-blood-drive',
  NEED_HELP: 'need-help'
};

export const TABLE_HEADERS = {
  DONATE_BLOOD: ["Name", "Email", "Phone", "Blood Type", "Message", "Donated", "Actions"],
  NEED_BLOOD: ["Name", "Phone", "Blood Type", "Message", "Actions"],
  HOST_BLOOD_DRIVE: ["Name", "Email", "Phone", "Institute", "City", "Actions"],
  NEED_HELP: ["Name", "Phone", "Reason", "Message", "Actions"]
};

export const FILTER_OPTIONS = {
  DONATE_BLOOD: [
    { id: 1, name: "All", value: "all" },
    { id: 2, name: "Name", value: "name" },
    { id: 3, name: "Phone", value: "phone" },
    { id: 4, name: "Email", value: "email" },
    { id: 5, name: "Blood Type", value: "bloodType" },
    { id: 6, name: "Donated", value: "donated" }
  ],
  NEED_BLOOD: [
    { id: 1, name: "All", value: "all" },
    { id: 2, name: "Name", value: "name" },
    { id: 3, name: "Phone", value: "phone" },
    { id: 4, name: "Blood Type", value: "bloodType" }
  ]
  // Add more filter options as needed
};
