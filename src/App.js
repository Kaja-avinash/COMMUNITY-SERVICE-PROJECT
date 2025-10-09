import React, { useState, useMemo, useEffect, useRef } from "react";
import "./App.css"; 

// =================================================================
// 🚨 IMPORTANT: LEAFLET INTEGRATION 🚨
// This requires the Leaflet library to be installed and its CSS linked.
// 1. Run: npm install leaflet
// 2. Ensure the CSS is imported (e.g., in your main index.js or here):
import 'leaflet/dist/leaflet.css';
// =================================================================
import L from "leaflet";

// Lucide icons
import {
  Droplet,
  Bell,
  MessageCircle,
  LayoutDashboard,
  Globe,
  MapIcon,
  Users,
  Home,
  MapPin,
  List,
} from "lucide-react";

// ------------------------------
// Translations
// ------------------------------
const translations = {
  en: {
    dashboard: "Dashboard",
    map: "Map",
    admin: "Admin",
    title: "AquaAlert System",
    subtitle: "Local Water Supply Information",
    userId: "Demo User ID: Anonymous",
    villageInfo: "Village Information",
    population: "Population",
    households: "Households",
    nearestTown: "Nearest Town",
    realtimeAlerts: "Real-time Alerts",
    waterSchedule: "Water Supply Schedule",
    status: "Status:",
    available: "💧 Water Available",
    scheduled: "⏳ Scheduled/Maintenance",
    noAlerts: "No active alerts at this time.",
    adminLogin: "Admin Login",
    enterPassword: "Enter password",
    login: "Login",
    backToUser: "Back to User Page",
    adminDashboard: "Admin Dashboard",
    manageSchedule: "Manage Water Schedule & Status",
    morningTime: "Morning Supply Time:",
    eveningTime: "Evening Supply Time:",
    customNotice: "Custom Notice:",
    applyUpdates: "Apply Updates",
    changePassword: "Change Password",
    newPassword: "Enter new password",
    logout: "Logout to User Page",
    languageToggle: "Language",
    // Incident Reporting
    reportIncident: "Report an Incident",
    describeIssue: "Describe the issue...",
    submitReport: "Submit Report",
    recentIncidents: "Recent Incidents",
    noIncidents: "No incidents have been reported yet.",
    // Admin Incident Management
    incidentReports: "User Incident Reports",
    // Map View
    interactiveMap: "Interactive Map - Kanteru Village",
    standposts: "Standposts",
    lowTds: "Low TDS",
    highTds: "High TDS",
    incidents: "Incidents",
    // Hardcoded Village Info
    kanteruPopulation: "4,942 (2011)",
    kanteruHouseholds: "1,385",
    kanteruNearestTown: "Mangalagiri (13 km)",
  },
  te: {
    dashboard: "డ్యాష్‌బోర్డ్",
    map: "మ్యాప్",
    admin: "అడ్మిన్",
    title: "ఆక్వాఅలర్ట్ సిస్టమ్",
    subtitle: "స్థానిక నీటి సరఫరా సమాచారం",
    userId: "డెమో యూజర్ ఐడి: అనామక",
    villageInfo: "గ్రామం సమాచారం",
    population: "జనాభా",
    households: "కుటుంబాలు",
    nearestTown: "సమీప పట్టణం",
    realtimeAlerts: "రియల్-టైమ్ హెచ్చరికలు",
    waterSchedule: "నీటి సరఫరా షెడ్యూల్",
    status: "స్థితి:",
    available: "💧 నీరు అందుబాటులో ఉంది",
    scheduled: "⏳ షెడ్యూల్/నిర్వహణ",
    noAlerts: "ప్రస్తుతం ఎటువంటి హెచ్చరికలు లేవు.",
    adminLogin: "అడ్మిన్ లాగిన్",
    enterPassword: "పాస్‌వర్డ్‌ను నమోదు చేయండి",
    login: "లాగిన్",
    backToUser: "వినియోగదారు పేజీకి వెళ్లండి",
    adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్",
    manageSchedule: "నీటి షెడ్యూల్ & స్థితిని నిర్వహించండి",
    morningTime: "ఉదయం సరఫరా సమయం:",
    eveningTime: "సాయంత్రం సరఫరా సమయం:",
    customNotice: "అనుకూల నోటీసు:",
    applyUpdates: "అప్‌డేట్‌లను వర్తించు",
    changePassword: "పాస్‌వర్డ్ మార్చండి",
    newPassword: "కొత్త పాస్‌వర్డ్‌ను నమోదు చేయండి",
    logout: "వినియోగదారు పేజీకి లాగౌట్",
    languageToggle: "భాష",
    // Incident Reporting
    reportIncident: "ఒక సంఘటనను నివేదించండి",
    describeIssue: "సమస్యను వివరించండి...",
    submitReport: "నివేదికను సమర్పించండి",
    recentIncidents: "ఇటీవలి సంఘటనలు",
    noIncidents: "ఇంకా ఏ సంఘటనలు నివేదించబడలేదు.",
    // Admin Incident Management
    incidentReports: "వినియోగదారు సంఘటన నివేదికలు",
    // Map View
    interactiveMap: "ఇంటరాక్టివ్ మ్యాప్ - కాన్టేరు గ్రామం",
    standposts: "స్టాండ్‌పోస్ట్‌లు",
    lowTds: "తక్కువ టీడీఎస్",
    highTds: "ఎక్కువ టీడీఎస్",
    incidents: "సంఘటనలు",
    // Hardcoded Village Info
    kanteruPopulation: "4,942 (2011)",
    kanteruHouseholds: "1,385",
    kanteruNearestTown: "మంగళగిరి (13 కి.మీ)",
  },
  hi: { 
    dashboard: "डैशबोर्ड",
    map: "नक्शा",
    admin: "एडमिन",
    title: "एक्वालर्ट सिस्टम",
    subtitle: "स्थानीय जल आपूर्ति जानकारी",
    userId: "डेमो उपयोगकर्ता आईडी: अनाम",
    villageInfo: "गाँव की जानकारी",
    population: "जनसंख्या",
    households: "परिवार",
    nearestTown: "निकटतम शहर",
    realtimeAlerts: "रीयल-टाइम अलर्ट",
    waterSchedule: "जल आपूर्ति अनुसूची",
    status: "स्थिति:",
    available: "💧 जल उपलब्ध",
    scheduled: "⏳ निर्धारित/रखरखाव",
    noAlerts: "इस समय कोई सक्रिय अलर्ट नहीं हैं।",
    adminLogin: "एडमिन लॉगिन",
    enterPassword: "पासवर्ड दर्ज करें",
    login: "लॉगिन करें",
    backToUser: "उपयोगकर्ता पेज पर वापस",
    adminDashboard: "एडमिन डैशबोर्ड",
    manageSchedule: "जल अनुसूची और स्थिति प्रबंधित करें",
    morningTime: "सुबह की आपूर्ति का समय:",
    eveningTime: "शाम की आपूर्ति का समय:",
    customNotice: "कस्टम नोटिस:",
    applyUpdates: "अपडेट लागू करें",
    changePassword: "पासवर्ड बदलें",
    newPassword: "नया पासवर्ड दर्ज करें",
    logout: "उपयोगकर्ता पेज पर लॉगआउट करें",
    languageToggle: "भाषा",
    // Incident Reporting
    reportIncident: "एक घटना की रिपोर्ट करें",
    describeIssue: "समस्या का वर्णन करें...",
    submitReport: "रिपोर्ट जमा करें",
    recentIncidents: "हाल की घटनाएँ",
    noIncidents: "अभी तक किसी घटना की रिपोर्ट नहीं की गई है।",
    // Admin Incident Management
    incidentReports: "उपयोगकर्ता घटना रिपोर्ट",
    // Map View
    interactiveMap: "इंटरैक्टिव नक्शा - कांतेरु गाँव",
    standposts: "स्टैंडपोस्ट",
    lowTds: "कम टीडीएस",
    highTds: "उच्च टीडीएस",
    incidents: "घटनाएँ",
    // Hardcoded Village Info
    kanteruPopulation: "4,942 (2011)",
    kanteruHouseholds: "1,385",
    kanteruNearestTown: "मंगल गिरि (13 किमी)",
  },
};

// Default Values and LocalStorage Helpers
const ADMIN_PASSWORD_KEY = "aquaAlertAdminPassword";
const DATA_KEY = "aquaAlertData";
const INCIDENTS_KEY = "aquaAlertIncidents";
const DEFAULT_PASSWORD = "VVITCSP2025";
const DEFAULT_DATA = {
  morningTime: "6:00 AM - 8:00 AM",
  eveningTime: "6:00 PM - 8:00 PM",
  status: "available",
  notice: "No maintenance scheduled today.",
};

const getInitialData = () => {
  try {
    const stored = localStorage.getItem(DATA_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DATA;
  } catch (e) {
    return DEFAULT_DATA;
  }
};

const getInitialPassword = () => {
  try {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
  } catch (e) {
    return DEFAULT_PASSWORD;
  }
};

const getInitialIncidents = () => {
  try {
    const stored = localStorage.getItem(INCIDENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

// Static Kanteru coordinates for map initialization
const kanteruCoords = { lat: 16.3917, lng: 80.5036 };

// ------------------------------
// Main Component
// ------------------------------
export default function App() {
  // --- Data State (Persisted in localStorage) ---
  const [data, setData] = useState(getInitialData);
  const [adminPassword, setAdminPassword] = useState(getInitialPassword);
  const [incidentReports, setIncidentReports] = useState(getInitialIncidents);

  // --- UI/App State ---
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [view, setView] = useState("dashboard"); 
  const [passwordInput, setPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newIncidentInput, setNewIncidentInput] = useState("");

  // --- Map Refs and Initialization ---
  const mapRef = useRef(null);
  
  // Memoized translation object
  const t = useMemo(() => translations[language] || translations.en, [language]);

  // --- Persistence Handlers (No change) ---
  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(ADMIN_PASSWORD_KEY, adminPassword);
  }, [adminPassword]);
  
  useEffect(() => {
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidentReports));
  }, [incidentReports]);


  // Helper: ensure map sizes correctly (fixes "half map" / cropped tiles)
  const safelyInvalidateSize = () => {
    if (!mapRef.current) return;
    // Multiple passes help when the map is inside a recently shown container
    requestAnimationFrame(() => mapRef.current && mapRef.current.invalidateSize());
    setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 150);
    setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 400);
  };
  
  // --- LEAFLET MAP EFFECT ---
  useEffect(() => {
    if (view !== "map") {
      // Cleanup map when leaving view
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch {}
        mapRef.current = null;
      }
      return;
    }

    // Ensure container exists
    const container = document.getElementById("map-container");
    if (!container) return;
    
    // If a Leaflet map instance is already attached to this container, remove it
    if (mapRef.current) {
      try { mapRef.current.remove(); } catch {}
      mapRef.current = null;
    }

    // --- Map Initialization ---
    try {
        const map = L.map("map-container", {
            center: [kanteruCoords.lat, kanteruCoords.lng],
            zoom: 14,
            preferCanvas: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            updateWhenIdle: true,
            updateWhenZooming: false,
            keepBuffer: 5,
        }).addTo(map);

        // Add a marker for the Kanteru center
        L.marker([kanteruCoords.lat, kanteruCoords.lng])
            .bindPopup("<b>Kanteru Village Center</b>")
            .addTo(map);

        mapRef.current = map;
        
        // Invalidate size a few times to ensure proper layout after render
        safelyInvalidateSize();

        const onResize = () => safelyInvalidateSize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            // Cleanup map on unmount/view change
            if (mapRef.current) {
                try { mapRef.current.remove(); } catch {}
                mapRef.current = null;
            }
        };

    } catch (e) {
        // This catches errors if Leaflet icons or initialization fail
        console.error("Failed to initialize Leaflet map:", e);
    }
    
    // Clean up on component unmount
    return () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch {}
        mapRef.current = null;
      }
    };
  }, [view]);

  // --- Handlers (No change) ---
  const handleAdminLogin = () => {
    if (passwordInput === adminPassword) {
      setView("adminDashboard");
      setPasswordInput("");
    } else {
      alert("Incorrect password!");
      setPasswordInput("");
    }
  };

  const handleUpdate = () => {
    if (!data.morningTime || !data.eveningTime || !data.status) {
      alert("Please fill all required fields!");
      return;
    }
    setData({...data});
    alert("Updates applied successfully!");
  };

  const handleChangePassword = () => {
    if (newPasswordInput.length < 6) {
      alert("Password should be at least 6 characters!");
      return;
    }
    setAdminPassword(newPasswordInput);
    setNewPasswordInput("");
    alert("Password changed successfully!");
  };

  const handleLogout = () => {
    setView("dashboard");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };
  
  const handleIncidentSubmit = (e) => {
    e.preventDefault();
    if (!newIncidentInput.trim()) {
        alert("Please describe the incident before submitting.");
        return;
    }

    const newReport = {
        id: Date.now(),
        description: newIncidentInput.trim(),
        timestamp: new Date().toLocaleString(),
        status: "Reported",
    };

    setIncidentReports(prev => [...prev, newReport]);
    setNewIncidentInput("");
    alert("Incident reported successfully! The village admin has been notified.");
  };

  // --- Views ---

  // 1. Admin Login View (No change)
  const renderAdminLogin = () => (
    <section className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700 text-center">
      <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400 mb-6">
        <LayoutDashboard className="w-7 h-7" />
        {t.adminLogin}
      </h2>
      <input
        type="password"
        placeholder={t.enterPassword}
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleAdminLogin}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors font-semibold mb-4"
      >
        {t.login}
      </button>
      <button
        onClick={() => setView("dashboard")}
        className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
      >
        {t.backToUser}
      </button>
    </section>
  );

  // 2. Admin Dashboard View (No change)
  const renderAdminDashboard = () => (
    <section className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700">
      <h2 className="text-3xl font-bold flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-6">
        <LayoutDashboard className="w-7 h-7" />
        {t.adminDashboard}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Schedule Management */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{t.manageSchedule}</h3>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.morningTime}</span>
              <input
                type="text"
                value={data.morningTime}
                onChange={(e) => setData({ ...data, morningTime: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.eveningTime}</span>
              <input
                type="text"
                value={data.eveningTime}
                onChange={(e) => setData({ ...data, eveningTime: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.status}</span>
              <select
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="available">Water Available</option>
                <option value="maintenance">Scheduled/Maintenance</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.customNotice}</span>
              <input
                type="text"
                value={data.notice}
                onChange={(e) => setData({ ...data, notice: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                placeholder="e.g., Tank cleaning today"
              />
            </label>
          </div>
          <button
            onClick={handleUpdate}
            className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-colors font-semibold"
          >
            {t.applyUpdates}
          </button>
        </div>
        
        {/* Incident Reports Display */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
            <List className="w-5 h-5" />
            {t.incidentReports}
          </h3>
          <div className="h-64 overflow-y-auto space-y-3 p-1">
            {incidentReports.length > 0 ? (
              [...incidentReports].reverse().map((report) => ( // Display newest first
                <div key={report.id} className="p-3 bg-red-50 dark:bg-gray-600 rounded-md border border-red-200 dark:border-red-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{report.description}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    **{report.status}** | {report.timestamp}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-8 text-center">{t.noIncidents}</p>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="md:col-span-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{t.changePassword}</h3>
            <input
            type="password"
            placeholder={t.newPassword}
            value={newPasswordInput}
            onChange={(e) => setNewPasswordInput(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
            onClick={handleChangePassword}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition-colors font-semibold"
            >
            {t.changePassword}
            </button>
        </div>

      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3 px-4 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-colors font-semibold mt-4"
      >
        {t.logout}
      </button>
    </section>
  );

  // 3. Map View (Actual Leaflet Map)
  const renderMapView = () => (
    <section className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border border-teal-200 dark:border-teal-700">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-teal-600 dark:text-teal-400 mb-4">
            <MapPin className="w-6 h-6" />
            {t.interactiveMap}
        </h2>
        
        {/*
          This container will hold the Leaflet map instance initialized in the useEffect hook.
        */}
        <div 
            id="map-container" 
            className="w-full h-96 min-h-[24rem] rounded-lg border-2 border-gray-300 dark:border-gray-600" 
        />
        
        {/* Legend Placeholder */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm font-medium text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500 border border-white" /> {t.standposts}
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500 border border-white" /> {t.lowTds}
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500 border border-white" /> {t.highTds}
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500 border border-white" /> {t.incidents}
            </div>
        </div>
    </section>
  );
  
  // 4. User Dashboard View (No change)
  const renderUserDashboard = () => (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* --- Restored Village Information Section (Static Data) --- */}
      <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-200 mb-4">
          <MapIcon className="w-6 h-6" />
          {t.villageInfo}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.population}</p>
              <p className="text-lg font-semibold">{t.kanteruPopulation}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg flex items-center gap-3">
            <Home className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.households}</p>
              <p className="text-lg font-semibold">{t.kanteruHouseholds}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg flex items-center gap-3">
            <MapPin className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.nearestTown}</p>
              <p className="text-lg font-semibold">{t.kanteruNearestTown}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Live Water Supply Status (Original Style, No Background) --- */}
      <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border-4 border-blue-500 dark:border-blue-600">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400 mb-4">
            <Droplet className="w-6 h-6" /> Live Water Supply Status
        </h2>
        <div className="info-box text-gray-800 dark:text-gray-200" style={{ 
            margin: "0 auto", 
            padding: "20px", 
            border: "2px solid #0077b6", 
            borderRadius: "10px", 
            textAlign: 'center',
        }}>
            <p className="text-lg mb-2"><strong>{t.morningTime}</strong> {data.morningTime}</p>
            <p className="text-lg mb-2"><strong>{t.eveningTime}</strong> {data.eveningTime}</p>
            <p className="text-xl font-extrabold mb-3" style={{ color: data.status === 'available' ? '#0077b6' : '#d32f2f' }}>
                {t.status} {data.status === 'available' ? t.available : t.scheduled}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300">
                <strong>Notice:</strong> {data.notice}
            </p>
        </div>
        <button 
            onClick={() => setView("adminLogin")} 
            className="mt-6 mx-auto block py-2 px-6 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition-colors font-semibold"
        >
            {t.adminLogin}
        </button>
      </section>
      
      {/* --- Incident Reporting Form --- */}
      <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border border-teal-200 dark:border-teal-700">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-teal-600 dark:text-teal-400 mb-4">
          <MessageCircle className="w-6 h-6" />
          {t.reportIncident}
        </h2>
        <form onSubmit={handleIncidentSubmit}>
            <textarea
            rows={3}
            placeholder={t.describeIssue}
            value={newIncidentInput}
            onChange={(e) => setNewIncidentInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700"
            required
            />
            <button 
                type="submit"
                className="w-full mt-3 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition-colors font-semibold"
            >
                {t.submitReport}
            </button>
        </form>
        
        {/* Simple display of recent incidents for the user */}
        <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t.recentIncidents}</h3>
            <div className="h-24 overflow-y-auto space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {incidentReports.slice(-3).reverse().map(report => (
                    <p key={report.id}>**{report.status}**: {report.description.substring(0, 50)}...</p>
                ))}
                {incidentReports.length === 0 && <p className="text-center">{t.noIncidents}</p>}
            </div>
        </div>
      </section>

    </div>
  );

  // --- Main Render Logic ---
  const getCurrentView = () => {
    if (view === "map") return renderMapView();
    if (view === "adminLogin") return renderAdminLogin();
    if (view === "adminDashboard") return renderAdminDashboard();
    return renderUserDashboard();
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-4xl p-4 bg-blue-600 text-white rounded-xl shadow-lg mb-8 text-center relative">
        <div className="absolute top-4 right-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors cursor-pointer dark:bg-blue-800 dark:border-none"
          >
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-4">
          <Droplet className="w-8 h-8 sm:w-10 sm:h-10" />
          {t.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base">{t.subtitle}</p>
      </header>
      
      {/* Navigation Bar */}
      <nav className="w-full max-w-4xl mb-6 flex justify-center space-x-4">
        <button
          onClick={() => setView("dashboard")}
          className={`py-2 px-6 rounded-full font-semibold transition-colors ${view === "dashboard" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          {t.dashboard}
        </button>
        <button
          onClick={() => setView("map")}
          className={`py-2 px-6 rounded-full font-semibold transition-colors ${view === "map" ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          {t.map}
        </button>
      </nav>

      <div className="w-full max-w-4xl flex items-start justify-center">
        {getCurrentView()}
      </div>
    </div>
  );
}