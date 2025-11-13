import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";

// Lucide icons (UPDATED LIST)
import {
  Droplet,
  MessageCircle,
  LayoutDashboard,
  CloudRain,
  MapIcon,
  Users,
  Home,
  MapPin,
  List,
  Sun,
  Wind,
  Thermometer,
  AlertTriangle,
  Leaf,
  Lightbulb,
  ClipboardList,
  Volume2,
  Youtube,
  Zap,
  Sprout,
  Banknote, 
  LandPlot, 
} from "lucide-react";

// --- STATIC DATA AND LOCAL STORAGE HELPERS ---
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

// Static Kanteru coordinates (DEFINED ONCE)
const kanteruCoords = { lat: 16.3917, lng: 80.5036 };

// Simulated Weather Data
const SIMULATED_WEATHER_DATA = {
  current: { temperature: "29°C", feelsLike: "35°C", wind: "4 mph east", humidity: "80%", precipitationChance: "75%", condition: "Heavy Thunderstorm" },
  forecast: [
    { day: "Tuesday", high: "29°C", low: "24°C", condition: "Heavy thunderstorm", rainChance: 75, icon: 'rain' },
    { day: "Wednesday", high: "31°C", low: "24°C", condition: "Partly Cloudy", rainChance: 45, icon: 'cloud-sun' },
    { day: "Thursday", high: "32°C", low: "24°C", condition: "Mostly Sunny", rainChance: 10, icon: 'sun' },
    { day: "Friday", high: "31°C", low: "24°C", condition: "Cloudy with Showers", rainChance: 35, icon: 'cloud' },
    { day: "Saturday", high: "32°C", low: "24°C", condition: "High Rain Chance", rainChance: 65, icon: 'rain' },
  ],
};

const SIMULATED_UPDATED_WEATHER_DATA = {
  current: { temperature: "27°C", feelsLike: "32°C", wind: "10 mph north", humidity: "85%", precipitationChance: "90%", condition: "Heavy Rain / Flood Watch" },
  forecast: [
    { day: "Tuesday", high: "27°C", low: "24°C", condition: "Heavy Rain / Flood Watch", rainChance: 90, icon: 'rain' },
    { day: "Wednesday", high: "29°C", low: "23°C", condition: "Rain clearing up", rainChance: 60, icon: 'cloud-sun' },
    { day: "Thursday", high: "30°C", low: "24°C", condition: "Clear", rainChance: 5, icon: 'sun' },
    { day: "Friday", high: "31°C", low: "24°C", condition: "Sunny", rainChance: 0, icon: 'sun' },
    { day: "Saturday", high: "32°C", low: "24°C", condition: "Sunny", rainChance: 0, icon: 'sun' },
  ],
};

// UPDATED YOUTUBE LINKS
const YOUTUBE_LINKS = {
    drip: "https://www.youtube.com/watch?v=Cx_kX2oyn6E", 
    rwh: "https://www.youtube.com/watch?v=RjAV2Ye6R6s",
    subsidy: "https://www.youtube.com/watch?v=0k0KfYxA9DU",
    pmkisan_te: "https://www.youtube.com/watch?v=s-mYU4AILcw",
    rythubharosa_te: "https://www.youtube.com/watch?v=mg0J0_dhQ1s"
};



const getInitialDataFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(DATA_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DATA;
  } catch (e) {
    console.error("Error reading data from local storage:", e);
    return DEFAULT_DATA;
  }
};

const getInitialPasswordFromLocalStorage = () => {
  try {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
  } catch (e) {
    console.error("Error reading password from local storage:", e);
    return DEFAULT_PASSWORD;
  }
};

const getInitialIncidentsFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(INCIDENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading incidents from local storage:", e);
    return [];
  }
};

const getWeatherIcon = (condition) => {
  const normalized = condition.toLowerCase();
  if (normalized.includes('rain') || normalized.includes('thunderstorm') || normalized.includes('shower') || normalized.includes('flood')) {
    return <CloudRain className="w-8 h-8 text-blue-500" />;
  }
  if (normalized.includes('sun') || normalized.includes('clear')) {
    return <Sun className="w-8 h-8 text-yellow-500" />;
  }
  return <CloudRain className="w-8 h-8 text-gray-500" />;
};


// ------------------------------
// Translations (ALL FEATURES INCLUDED)
// ------------------------------
const translations = {
  en: {
    dashboard: "Water Status", agriculture: "Agriculture", map: "Map", weather: "Weather", admin: "Admin", title: "AquaAgri System",
    subtitle: "Water Supply & Sustainable Farming Support", userId: "Demo User ID: Anonymous", villageInfo: "Village Information",
    population: "Population", households: "Households", nearestTown: "Nearest Town", realtimeAlerts: "Real-time Alerts", waterSchedule: "Water Supply Schedule",
    status: "Status:", available: "💧 Water Available", scheduled: "⏳ Scheduled/Maintenance", noAlerts: "No active alerts at this time.",
    adminLogin: "Admin Login", enterPassword: "Enter password", login: "Login", backToUser: "Back to User Page",
    adminDashboard: "Admin Dashboard", manageSchedule: "Manage Water Schedule & Status", morningTime: "Morning Supply Time:",
    eveningTime: "Evening Supply Time:", customNotice: "Custom Notice:", applyUpdates: "Apply Updates", changePassword: "Change Password",
    newPassword: "Enter new password", logout: "Logout to User Page", languageToggle: "Language",
    
    reportResiIncident: "Report Residential/Water Issue", describeResiIssue: "Describe the water supply issue (e.g., sewage overflow, pipe leak, no water)...",
    reportAgriIncident: "Report Field/Crop Problem", describeAgriIssue: "Describe the crop/field problem (e.g., pest outbreak, irrigation damage, crop disease)...",
    submitReport: "Submit Report", recentIncidents: "Recent Submitted Problems", noIncidents: "No problems have been reported yet.",
    yourName: "Your Name", yourMobile: "Your Mobile Number", uploadImage: "Upload Photo of Issue (Optional)", incidentReports: "User Problem Reports (Water & Field)",
    
    agriDashboard: "Sustainable Agriculture Guidance", waterTips: "Water-Saving Tips & Awareness", schemeInfo: "Government Scheme Information", currentTip: "Current Tip:",
    tip1: "Adopt **Drip Irrigation** for 50% water saving and better yield.",
    tip2: "Learn **Rainwater Harvesting** for groundwater recharge and supplementary irrigation.",
    tip3: "Apply for **Micro-Irrigation Subsidy** to reduce equipment cost.",
    viewDetails: "View Full Details on YouTube 🎥", viewMore: "View Schemes...",
    
    weatherDashboard: "Weather Dashboard - Kanteru", currentConditions: "Current Conditions", fiveDayForecast: "5-Day Forecast",
    updateMessage: "Weather Data Automatically Updated! (Simulated)",
    
    agriProfile: "Kanteru Agricultural Profile", powerSupply: "Power Supply for Agriculture", powerTime: "8 hours daily (Summer & Winter)",
    irrigationSources: "Irrigation Sources (Total: 178.87 Ha)", areaCanal: "Canals: 121.4 Ha", areaBorewell: "Borewells/Tube Wells: 17.0 Ha",
    areaTank: "Lakes/Tanks: 40.47 Ha", landUse: "Land Use & Crops (Total Area: 368 Ha)", totalSown: "Total Sown/Irrigated Area: 311.99 Ha",
    commonCrops: "Common Seasonal Crops (Guntur Region)", cropsKharif: "Kharif (Monsoon): Paddy, Cotton, Chilies, Pulses.", cropsRabi: "Rabi (Winter): Bengal Gram, Paddy, Maize, Black Gram.",
    
    interactiveMap: "Interactive Map - Kanteru Village", standposts: "Standposts", lowTds: "Low TDS", highTds: "High TDS", incidents: "Problems",
    kanteruPopulation: "4,942 (2011)", kanteruHouseholds: "1,385", kanteruNearestTown: "Mangalagiri (13 km)",
    
    // SCHEME DATA
    centralSchemes: "Central Government Schemes",
    stateSchemes: "Andhra Pradesh State Schemes",
    schemePMKISAN: "**PM-KISAN:** Provides ₹6,000/year income support to eligible farmer families in three equal installments.",
    schemePMFBY: "**PM Fasal Bima Yojana:** Crop insurance scheme for financial support against crop failure due to natural disasters.",
    schemeYSRRB: "**YSR Rythu Bharosa:** State government scheme providing supplementary income support to farmers and tenant farmers.",
    viewOnYoutube: "View Telugu Explanation on YouTube 🎥",

    // RED ALERT MESSAGES
    redAlertWater: "🚨 RED ALERT: Potential Flood/Contamination Risk. Avoid low-lying areas and conserve purified water. 🚨",
    redAlertAgri: "🚨 RED ALERT: Heavy Rainfall Expected. Secure crops, check drainage systems, and halt irrigation. 🚨",
    redAlertWeather: "🚨 RED ALERT: Heavy Rain/Flood Watch Issued! Stay informed and safe. 🚨",
    rainChance: "Rain Chance", // Re-added to ensure it is defined
  },
  te: {
    dashboard: "నీటి స్థితి", agriculture: "వ్యవసాయం", map: "మ్యాప్", weather: "వాతావరణం", admin: "అడ్మిన్", title: "ఆక్వాఅగ్రి సిస్టమ్",
    subtitle: "నీటి సరఫరా & స్థిరమైన వ్యవసాయ మద్దతు", userId: "డెమో యూజర్ ఐడి: అనామక", villageInfo: "గ్రామం సమాచారం",
    population: "జనాభా", households: "కుటుంబాలు", nearestTown: "సమీప పట్టణం", realtimeAlerts: "రియల్-టైమ్ హెచ్చరికలు", waterSchedule: "నీటి సరఫరా షెడ్యూల్",
    status: "స్థితి:", available: "💧 నీరు అందుబాటులో ఉంది", scheduled: "⏳ షెడ్యూల్/నిర్వహణ", noAlerts: "ప్రస్తుతం ఎటువంటి హెచ్చరికలు లేవు.",
    adminLogin: "అడ్మిన్ లాగిన్", enterPassword: "పాస్‌వర్డ్‌ను నమోదు చేయండి", login: "లాగిన్", backToUser: "వినియోగదారు పేజీకి వెళ్లండి",
    adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్", manageSchedule: "నీటి షెడ్యూల్ & స్థితిని నిర్వహించండి", morningTime: "ఉదయం సరఫరా సమయం:",
    eveningTime: "సాయంత్రం సరఫరా సమయం:", customNotice: "అనుకూల నోటీసు:", applyUpdates: "అప్‌డేట్‌లను వర్తించు", changePassword: "పాస్‌వర్డ్ మార్చండి",
    newPassword: "కొత్త పాస్‌వర్డ్‌ను నమోదు చేయండి", logout: "వినియోగదారు పేజీకి లాగౌట్", languageToggle: "భాష",
    
    reportResiIncident: "నివాస/నీటి సమస్యను నివేదించండి", describeResiIssue: "నీటి సరఫరా సమస్యను వివరించండి (ఉదా. మురుగునీరు పొంగిపొర్లడం, పైపు లీక్, నీరు లేకపోవడం)...",
    reportAgriIncident: "పొలం/పంట సమస్యను నివేదించండి", describeAgriIssue: "పంట/పొలం సమస్యను వివరించండి (ఉదా. చీడపీడల వ్యాప్తి, నీటిపారుదల నష్టం, పంట తెగులు)...",
    submitReport: "నివేదికను సమర్పించండి", recentIncidents: "ఇటీవలి సమర్పించిన సమస్యలు", noIncidents: "ఇంకా ఏ సమస్యలు నివేదించబడలేదు.",
    yourName: "మీ పేరు", yourMobile: "మీ మొబైల్ నంబర్", uploadImage: "సమస్య యొక్క ఫోటోను అప్‌లోడ్ చేయండి (ఐచ్ఛికం)", incidentReports: "వినియోగదారు సమస్య నివేదికలు (నీరు & పొలం)",
    
    agriDashboard: "స్థిరమైన వ్యవసాయ మార్గదర్శకత్వం", waterTips: "నీటి ఆదా చిట్కాలు & అవగాహన", schemeInfo: "ప్రభుత్వ పథకాల సమాచారం", currentTip: "ప్రస్తుత చిట్కా:",
    tip1: "**బిందు సేద్యం (డ్రిప్ ఇరిగేషన్)**ను అవలంబించడం ద్వారా 50% నీటిని ఆదా చేయవచ్చు మరియు మంచి దిగుబడి పొందవచ్చు.",
    tip2: "**వర్షపు నీటి నిల్వ** గురించి తెలుసుకోండి భూగర్భ జలాలను పెంచడానికి మరియు అదనపు సేద్యానికి ఉపయోగించండి.",
    tip3: "పరికరాల ఖర్చును తగ్గించడానికి **సూక్ష్మ-సేద్యం సబ్సిడీ** కోసం దరఖాస్తు చేసుకోండి.",
    viewDetails: "పూర్తి వివరాలు YouTube లో చూడండి 🎥", viewMore: "పథకాలను చూడండి...",
    
    weatherDashboard: "వాతావరణ డ్యాష్‌బోర్డ్ - కాన్టేరు", currentConditions: "ప్రస్తుత పరిస్థితులు", fiveDayForecast: "5 రోజుల వాతావరణ అంచనా",
    updateMessage: "వాతావరణ డేటా స్వయంచాలకంగా అప్‌డేట్ చేయబడింది! (అనుకరణ)",
    
    agriProfile: "కాన్టేరు వ్యవసాయ ప్రొఫైల్", powerSupply: "వ్యవసాయ విద్యుత్ సరఫరా", powerTime: "8 గంటలు రోజువారీ (వేసవి & శీతాకాలం)",
    irrigationSources: "నీటిపారుదల వనరులు (మొత్తం: 178.87 హెక్టార్లు)", areaCanal: "కాలువలు: 121.4 హెక్టార్లు", areaBorewell: "బోరుబావులు/గొట్టపు బావులు: 17.0 హెక్టార్లు",
    areaTank: "సరస్సులు/ట్యాంకులు: 40.47 హెక్టార్లు", landUse: "భూ వినియోగం & పంటలు (మొత్తం విస్తీర్ణం: 368 హెక్టార్లు)", totalSown: "మొత్తం సాగు/నీటిపారుదల విస్తీర్ణం: 311.99 హెక్టార్లు",
    commonCrops: "సాధారణ కాలానుగుణ పంటలు (గుంటూరు ప్రాంతం)", cropsKharif: "ఖరీఫ్ (వర్షాకాలం): వరి, పత్తి, మిరప, పప్పు ధాన్యాలు.", cropsRabi: "రబీ (శీతాకాలం): శనగలు, వరి, మొక్కజొన్న, మినుములు.",
    
    interactiveMap: "ఇంటరాక్టివ్ మ్యాప్ - కాన్టేరు గ్రామం", standposts: "స్టాండ్‌పోస్ట్‌లు", lowTds: "తక్కువ టీడీఎస్", highTds: "ఎక్కువ టీడీఎస్", incidents: "సంఘటనలు",
    kanteruPopulation: "4,942 (2011)", kanteruHouseholds: "1,385", kanteruNearestTown: "మంగళగిరి (13 కి.మీ)",

    // SCHEME DATA
    centralSchemes: "కేంద్ర ప్రభుత్వ పథకాలు",
    stateSchemes: "ఆంధ్రప్రదేశ్ రాష్ట్ర పథకాలు",
    schemePMKISAN: "**పీఎం-కిసాన్:** అర్హులైన రైతు కుటుంబాలకు మూడు సమాన వాయిదాలలో సంవత్సరానికి ₹6,000 ఆదాయ మద్దతును అందిస్తుంది.",
    schemePMFBY: "**పీఎం ఫసల్ బీమా యోజన:** ప్రకృతి వైపరీత్యాల కారణంగా పంట నష్టం సంభవించినప్పుడు ఆర్థిక సహాయం కోసం పంటల బీమా పథకం.",
    schemeYSRRB: "**వైఎస్ఆర్ రైతు భరోసా:** రైతులకు మరియు కౌలు రైతులకు అదనపు ఆదాయ మద్దతును అందించే రాష్ట్ర ప్రభుత్వ పథకం.",
    viewOnYoutube: "YouTube లో తెలుగు వివరణ చూడండి 🎥",
    
    // RED ALERT MESSAGES
    redAlertWater: "🚨 రెడ్ అలర్ట్: వరదలు/కాలుష్య ప్రమాదం! లోతట్టు ప్రాంతాలకు దూరంగా ఉండండి మరియు శుద్ధి చేసిన నీటిని ఆదా చేయండి. 🚨",
    redAlertAgri: "🚨 రెడ్ అలర్ట్: భారీ వర్షపాతం అంచనా! పంటలను సురక్షితం చేయండి, డ్రైనేజీ వ్యవస్థలను తనిఖీ చేయండి మరియు నీటిపారుదల ఆపండి. 🚨",
    redAlertWeather: "🚨 రెడ్ అలర్ట్: భారీ వర్షం/వరదల హెచ్చరిక జారీ చేయబడింది! జాగ్రత్తగా మరియు సురక్షితంగా ఉండండి. 🚨",
    rainChance: "వర్షం పడే అవకాశం", // Re-added to ensure it is defined
  },
  hi: {
    dashboard: "जल स्थिति", agriculture: "कृषि", map: "नक्शा", weather: "मौसम", admin: "एडमिन", title: "एक्वाएग्री सिस्टम",
    subtitle: "जल आपूर्ति और टिकाऊ खेती सहायता", userId: "डेमो उपयोगकर्ता आईडी: अनाम", villageInfo: "गाँव की जानकारी",
    population: "जनसंख्या", households: "परिवार", nearestTown: "निकटतम शहर", realtimeAlerts: "रीयल-टाइम अलर्ट", waterSchedule: "जल आपूर्ति अनुसूची",
    status: "स्थिति:", available: "💧 जल उपलब्ध", scheduled: "⏳ निर्धारित/रखरखाव", noAlerts: "इस समय कोई सक्रिय अलर्ट नहीं हैं।",
    adminLogin: "एडमिन लॉगिन", enterPassword: "पासवर्ड दर्ज करें", login: "लॉगिन करें", backToUser: "उपयोगकर्ता पेज पर वापस",
    adminDashboard: "एडमिन डैशबोर्ड", manageSchedule: "जल अनुसूची और स्थिति प्रबंधित करें", morningTime: "सुबह की आपूर्ति का समय:",
    eveningTime: "शाम की आपूर्ति का समय:", customNotice: "कस्टम नोटिस:", applyUpdates: "अपडेट लागू करें", changePassword: "पासवर्ड बदलें",
    newPassword: "नया पासवर्ड दर्ज करें", logout: "उपयोगकर्ता पेज पर लॉगआउट करें", languageToggle: "भाषा",
    
    reportResiIncident: "आवासीय/जल समस्या रिपोर्ट करें", describeResiIssue: "जल आपूर्ति समस्या का वर्णन करें (उदाहरण: सीवेज ओवरफ्लो, पाइप रिसाव, पानी नहीं)...",
    reportAgriIncident: "खेत/फसल समस्या रिपोर्ट करें", describeAgriIssue: "फसल/खेत समस्या का वर्णन करें (उदाहरण: कीट प्रकोप, सिंचाई क्षति, फसल रोग)...",
    submitReport: "रिपोर्ट जमा करें", recentIncidents: "हाल की सबमिट की गई समस्याएँ", noIncidents: "अभी तक कोई समस्या रिपोर्ट नहीं की गई है।",
    yourName: "आपका नाम", yourMobile: "आपका मोबाइल नंबर", uploadImage: "समस्या की फोटो अपलोड करें (वैकल्पिक)", incidentReports: "उपयोगकर्ता समस्या रिपोर्ट (जल और खेत)",
    
    agriDashboard: "टिकाऊ कृषि मार्गदर्शन", waterTips: "जल-बचत युक्तियाँ और जागरूकता", schemeInfo: "सरकारी योजना की जानकारी", currentTip: "वर्तमान टिप:",
    tip1: "50% पानी बचाने और बेहतर उपज के लिए **ड्रिप सिंचाई** अपनाएं।",
    tip2: "**वर्षा जल संचयन** के बारे में जानें, भूजल पुनर्भरण और पूरक सिंचाई के लिए इसका उपयोग करें।",
    tip3: "उपकरण लागत को कम करने के लिए **सूक्ष्म-सिंचाई सब्सिडी** के लिए आवेदन करें।",
    viewDetails: "YouTube पर हिंदी/तेलुगु में विवरण देखें 🎥",
    
    // RED ALERT MESSAGES
    redAlertWater: "🚨 रेड अलर्ट: संभावित बाढ़/दूषण जोखिम। निचले इलाकों से बचें और शुद्ध पानी का संरक्षण करें. 🚨",
    redAlertAgri: "🚨 रेड अलर्ट: भारी वर्षा की संभावना। फसलों को सुरक्षित करें, जल निकासी प्रणालियों की जांच करें, और सिंचाई रोकें. 🚨",
    redAlertWeather: "🚨 रेड अलर्ट: भारी बारिश/बाढ़ की चेतावनी जारी! सूचित और सुरक्षित रहें. 🚨",
    rainChance: "बारिश की संभावना", // Re-added to ensure it is defined
  },
};


// Function to inject Leaflet CSS and JS via CDN
// This function handles the compilation errors by loading external resources asynchronously.
const loadLeaflet = () => {
  // Use a global L reference which will be available after the script loads
  if (window.L) return Promise.resolve(window.L);

  return new Promise((resolve) => {
    // 1. Inject CSS
    if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(link);
    }
    
    // 2. Inject JS
    if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
        script.onload = () => {
            // Once loaded, 'L' should be globally available
            resolve(window.L);
        };
        script.onerror = () => {
            console.error("Failed to load Leaflet script.");
            resolve(null);
        };
        document.head.appendChild(script);
    } else {
        // Fallback for cases where script might have been loaded by another component
        setTimeout(() => resolve(window.L), 100); 
    }
  });
};


// ------------------------------
// Main Component
// ------------------------------
export default function App() {
  // --- Data State (Persisted in localStorage) ---
  const [data, setData] = useState(getInitialDataFromLocalStorage);
  const [adminPassword, setAdminPassword] = useState(getInitialPasswordFromLocalStorage);
  const [incidentReports, setIncidentReports] = useState(getInitialIncidentsFromLocalStorage);
  // NEW: Weather Data State
  const [weatherData, setWeatherData] = useState(SIMULATED_WEATHER_DATA);
  const [showWeatherUpdate, setShowWeatherUpdate] = useState(false);

  // --- UI/App State ---
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [view, setView] = useState("dashboard");
  const [passwordInput, setPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  // New state to track Leaflet load status
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false); 
  
  // NEW: Incident Reporting Fields
  const [newIncidentInput, setNewIncidentInput] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterMobile, setReporterMobile] = useState("");
  const [incidentImage, setIncidentImage] = useState(null);

  // --- Map Refs and Initialization ---
  // mapRef will hold the Leaflet map instance
  const mapRef = useRef(null);
  
  // Memoized translation object
  const t = useMemo(() => translations[language] || translations.en, [language]);
  
  // Derived State for Red Alert
  const isRedAlert = weatherData.forecast.length > 0 && weatherData.forecast[0].rainChance >= 65;

  // --- LEAFLET LOADER EFFECT ---
  // Loads Leaflet only when the map view is requested
  useEffect(() => {
    if (view === "map" && !isLeafletLoaded) {
      loadLeaflet().then(LInstance => {
        if (LInstance) {
          setIsLeafletLoaded(true);
        }
      });
    }
    // Also, reset loaded state if leaving map view, preparing for next load
    if (view !== "map" && isLeafletLoaded) {
        setIsLeafletLoaded(false);
    }

  }, [view, isLeafletLoaded]);
  
  // --- TELUGU AUDIO GUIDANCE FUNCTION (SIMULATED) ---
  // FIX: Wrapped playAudio in useCallback and added 'language' as a dependency.
  const playAudio = useCallback((audioFileName) => {
    if (language !== 'te') return;
    const cleanFileName = audioFileName.replace('telugu_', '').toUpperCase();
    console.log(`[SIMULATING AUDIO PLAYBACK]: Request to play ${audioFileName}.mp3`);
    alert(`🔊 Playing Audio: ${cleanFileName} in Telugu`);
  }, [language]); 
  
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

  // --- SIMULATED AUTOMATIC WEATHER UPDATE EFFECT ---
  // FIX: Added 'playAudio' to the dependency array, resolving the ESLint warning.
  useEffect(() => {
    const interval = setTimeout(() => {
      // Only update if not already the updated data
      if (weatherData.current.condition !== SIMULATED_UPDATED_WEATHER_DATA.current.condition) {
        setWeatherData(SIMULATED_UPDATED_WEATHER_DATA);
        setShowWeatherUpdate(true);
        if (isRedAlert) {
          playAudio('telugu_red_alert'); // Play alert audio only if the new data triggers it
        }
        setTimeout(() => setShowWeatherUpdate(false), 5000);
      }
    }, 15000); // Update after 15 seconds

    return () => clearTimeout(interval);
  }, [weatherData, isRedAlert, playAudio]); 
  
  // Helper: ensure map sizes correctly (fixes "half map" / cropped tiles)
  const safelyInvalidateSize = () => {
    // We assume L is now globally available after loadLeaflet resolves
    if (!mapRef.current || !window.L) return;
    // Attempt multiple times as a fallback for React's rendering lifecycle
    requestAnimationFrame(() => mapRef.current && mapRef.current.invalidateSize());
    setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 150);
    setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 400);
  };
  
  // --- LEAFLET MAP INITIALIZATION EFFECT ---
  useEffect(() => {
    // Only proceed if view is map AND Leaflet is confirmed loaded
    if (view !== "map" || !isLeafletLoaded || !window.L) {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch (e) { console.warn("Map cleanup failed:", e); }
        mapRef.current = null;
      }
      return;
    }
    
    const L = window.L; // Reference L globally
    const container = document.getElementById("map-container");
    if (!container) return;
    
    // Cleanup any existing map instance before creating a new one
    if (mapRef.current) {
      try { mapRef.current.remove(); } catch (e) { console.warn("Pre-init cleanup failed:", e); }
      mapRef.current = null;
    }

    try {
        const map = L.map("map-container", { center: [kanteruCoords.lat, kanteruCoords.lng], zoom: 14, preferCanvas: true });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', updateWhenIdle: true, updateWhenZooming: false, keepBuffer: 5, }).addTo(map);
        
        // --- ADDED MAP MARKERS FOR REQUESTED INFRASTRUCTURE ---
        
        // 1. Kanteru Village Center
        L.marker([kanteruCoords.lat, kanteruCoords.lng]).bindPopup("<b>Kanteru Village Center</b>").addTo(map);

        // 2. Water Storage Tank (Simulated - Blue in legend)
        // Explicitly specifying the required label in the popup
        L.marker([16.3950, 80.5080]).bindPopup("<b>Water Storage Tanks</b>").addTo(map);

        // 3. Agri Power Supply (Simulated - Yellow in legend)
        // Explicitly specifying the required label in the popup
        L.marker([16.3900, 80.4950]).bindPopup("<b>Agri Power Supply</b>").addTo(map);

        // 4. Soil/Resource Center (Regional Agricultural Research Station - Green in legend)
        // Explicitly specifying the required label in the popup
        L.marker([16.3600, 80.4300]).bindPopup("<b>Soil/Resource Center</b>").addTo(map);


        mapRef.current = map;
        // --------------------------------------------------------

        
        // Ensure map renders correctly after initial load
        safelyInvalidateSize();

        const onResize = () => safelyInvalidateSize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (mapRef.current) {
                try { mapRef.current.remove(); } catch (e) { console.warn("Final map cleanup failed:", e); }
                mapRef.current = null;
            }
        };

    } catch (e) {
        console.error("Failed to initialize Leaflet map:", e);
    }
    
    // Fallback cleanup return
    return () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch (e) { console.warn("Fallback map cleanup failed:", e); }
        mapRef.current = null;
      }
    };
  }, [view, isLeafletLoaded]); // Added isLeafletLoaded dependency to run map init after loading

  // --- Handlers ---
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
    // Update data state to trigger useEffect and local storage update
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

  // NEW: Dynamic Alert Message Function
  const getAlertMessage = (currentView) => {
    if (!isRedAlert) return null;
    
    if (currentView === 'agriculture') {
      return t.redAlertAgri;
    }
    if (currentView === 'weather') {
      return t.redAlertWeather;
    }
    // Default to Water/Dashboard alert
    return t.redAlertWater;
  };
  
  // Centralized Incident Submission Handler
  const handleIncidentSubmit = (e, type) => {
    e.preventDefault();
    
    if (!newIncidentInput.trim() || !reporterName.trim() || !reporterMobile.trim()) {
        playAudio('telugu_prompt_fill_fields');
        alert("Please enter your Name, Mobile Number, and describe the issue.");
        return;
    }

    const imageReference = incidentImage ? `Image: ${incidentImage.name}` : "No Photo Attached";

    const newReport = {
        id: Date.now(),
        description: newIncidentInput.trim(),
        reporterName: reporterName.trim(),
        reporterMobile: reporterMobile.trim(),
        imageReference: imageReference,
        type: type,
        timestamp: new Date().toLocaleString(),
        status: "Reported",
    };

    setIncidentReports(prev => [...prev, newReport]);
    
    setNewIncidentInput("");
    setReporterName("");
    setReporterMobile("");
    setIncidentImage(null);
    
    playAudio('telugu_prompt_report_success');
    alert(`Problem reported successfully! (${type} issue). The village admin has been notified.`);
  };


  // --- VIEWS ---

  // Helper function to render the form (used in both Dashboards)
  const renderIncidentForm = (type) => {
    const isResi = type === 'Residential';
    const title = isResi ? t.reportResiIncident : t.reportAgriIncident;
    const placeholder = isResi ? t.describeResiIssue : t.describeAgriIssue;
    
    // Agriculture form uses lime/green, Residential uses teal
    const titleColor = isResi ? 'text-teal-600 dark:text-teal-400' : 'text-lime-700 dark:text-lime-400';
    const buttonBg = isResi ? 'bg-teal-600 hover:bg-teal-700' : 'bg-lime-600 hover:bg-lime-700';

    return (
      <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className={`text-2xl font-bold flex items-center gap-3 mb-4 ${titleColor}`}>
          <MessageCircle className={`w-6 h-6 ${titleColor}`} /> 
          {title}
          {language === 'te' && <Volume2 className="w-5 h-5 ml-2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => playAudio(`telugu_prompt_report_${isResi ? 'resi' : 'agri'}`)} />}
        
        </h2>
        <form onSubmit={(e) => handleIncidentSubmit(e, type)}>
            
            {/* Name Input with Audio */}
            <div className="flex items-center mb-3">
              <input type="text" placeholder={t.yourName} value={reporterName} onChange={(e) => setReporterName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700" required />
              {language === 'te' && <Volume2 className="w-5 h-5 ml-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => playAudio('telugu_prompt_name')} />}
            </div>
            
            {/* Mobile Number Input with Audio */}
            <div className="flex items-center mb-3">
              <input type="tel" placeholder={t.yourMobile} value={reporterMobile} onChange={(e) => setReporterMobile(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700" required />
              {language === 'te' && <Volume2 className="w-5 h-5 ml-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => playAudio('telugu_prompt_mobile')} />}
            </div>

            {/* Image Upload Input (Audio is optional here) */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.uploadImage}</span>
              <input type="file" accept="image/*" onChange={(e) => setIncidentImage(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 dark:file:bg-gray-600 dark:file:text-gray-300 dark:text-gray-400" />
            </label>

            {/* Description Textarea with Audio */}
            <div className="flex items-start">
              <textarea rows={3} placeholder={placeholder} value={newIncidentInput} onChange={(e) => setNewIncidentInput(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700" required />
              {language === 'te' && <Volume2 className="w-5 h-5 ml-2 mt-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => playAudio(`telugu_prompt_describe_${isResi ? 'resi' : 'agri'}`)} />}
            </div>
            
            {/* Submit Button with Hover */}
            <button type="submit" className={`w-full mt-3 py-2 text-white rounded-xl shadow-md transition-colors font-semibold ${buttonBg}`}
              onClick={() => language === 'te' && playAudio('telugu_prompt_submit')}
            >
              {t.submitReport}
            </button>
          </form>
      </section>
    );
  };

  // Helper component for rendering a scheme item
  const SchemeItem = ({ schemeText, youtubeLink }) => (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-600 hover:shadow-lg transition-shadow">
      <p className="font-semibold text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: schemeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1 mt-1">
        <Youtube className="w-4 h-4" /> {t.viewOnYoutube}
      </a>
    </div>
  );

  // Helper function to render central schemes
  const renderCentralSchemes = () => (
      <section className="p-6 rounded-2xl shadow-lg border border-green-300 dark:border-green-600 bg-green-50 dark:bg-gray-700">
        <h3 className="text-xl font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-4">
          <Banknote className="w-5 h-5 text-green-700 dark:text-green-400" /> {t.centralSchemes}
        </h3>
        <div className="space-y-3">
          <SchemeItem schemeText={t.schemePMKISAN} youtubeLink={YOUTUBE_LINKS.pmkisan_te} />
          <SchemeItem schemeText={t.schemePMFBY} youtubeLink={YOUTUBE_LINKS.rwh} /> 
        </div>
      </section>
  );

  // Helper function to render state schemes
  const renderStateSchemes = () => (
      <section className="p-6 rounded-2xl shadow-lg border border-green-300 dark:border-green-600 bg-green-50 dark:bg-gray-700">
        <h3 className="text-xl font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-4">
          <LandPlot className="w-5 h-5 text-green-700 dark:text-green-400" /> {t.stateSchemes}
        </h3>
        <div className="space-y-3">
          <SchemeItem schemeText={t.schemeYSRRB} youtubeLink={YOUTUBE_LINKS.rythubharosa_te} />
          <SchemeItem schemeText={t.tip3} youtubeLink={YOUTUBE_LINKS.subsidy} /> 
        </div>
      </section>
  );


  // 1. Admin Login View 
  const renderAdminLogin = () => (
    <section className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700 text-center">
      <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400 mb-6">
        <LayoutDashboard className="w-7 h-7" />
        {t.adminLogin}
      </h2>
      <input type="password" placeholder={t.enterPassword} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button onClick={handleAdminLogin} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors font-semibold mb-4" > {t.login} </button>
      <button onClick={() => setView("dashboard")} className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors" > {t.backToUser} </button>
    </section>
  );

  // 2. Admin Dashboard View 
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
            <label className="block"> <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.morningTime}</span> <input type="text" value={data.morningTime} onChange={(e) => setData({ ...data, morningTime: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600" /> </label>
            <label className="block"> <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.eveningTime}</span> <input type="text" value={data.eveningTime} onChange={(e) => setData({ ...data, eveningTime: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600" /> </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.status}</span>
              <select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600" >
                <option value="available">Water Available</option>
                <option value="maintenance">Scheduled/Maintenance</option>
              </select>
            </label>
            <label className="block"> <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.customNotice}</span> <input type="text" value={data.notice} onChange={(e) => setData({ ...data, notice: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600" placeholder="e.g., Tank cleaning today" /> </label>
          </div>
          <button onClick={handleUpdate} className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-colors font-semibold" > {t.applyUpdates} </button>
        </div>
        
        {/* Incident Reports Display (No hover needed on list items, but added to report type box) */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
            <List className="w-5 h-5" />
            {t.incidentReports}
          </h3>
          <div className="h-64 overflow-y-auto space-y-3 p-1">
            {incidentReports.length > 0 ? (
              [...incidentReports].reverse().map((report) => ( 
                <div key={report.id} className={`p-3 rounded-md shadow-sm border ${report.type === 'Residential' ? 'bg-teal-50 dark:bg-gray-600 border-teal-300 hover:bg-teal-100 dark:hover:bg-gray-500' : 'bg-red-50 dark:bg-gray-600 border-red-300 hover:bg-red-100 dark:hover:bg-gray-500'} transition-colors`}>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{report.description}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    **Type:** {report.type || 'N/A'} | **Reporter:** {report.reporterName || 'N/A'} | **Mobile:** {report.reporterMobile || 'N/A'}
                  </p>
                  <p className={`text-xs mt-1 ${report.imageReference?.includes("No Photo") ? 'text-gray-500' : 'text-blue-500'}`}> **Photo:** {report.imageReference || 'N/A'} </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1"> **{report.status}** | {report.timestamp} </p>
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
            <input type="password" placeholder={t.newPassword} value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button onClick={handleChangePassword} className="w-full py-2 px-4 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition-colors font-semibold" > {t.changePassword} </button>
        </div>

      </div>

      <button onClick={handleLogout} className="w-full py-3 px-4 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-colors font-semibold mt-4" > {t.logout} </button>
    </section>
  );

  // 3. Map View (Actual Leaflet Map - Using Teal/Aqua)
  const renderMapView = () => (
    <section className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border border-teal-500 dark:border-teal-700 bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-teal-600 dark:text-teal-400 mb-4">
          <MapPin className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          {t.interactiveMap}
        </h2>
        
        {/* Added conditional message while Leaflet loads */}
        <div id="map-container" className="w-full h-96 min-h-[24rem] rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
            {!isLeafletLoaded && <p className="text-teal-500 animate-pulse font-semibold">Loading Map Infrastructure...</p>}
        </div>
        
        {/* Legend Placeholder - UPDATED FEATURES */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm font-medium text-gray-800 dark:text-gray-200">
          <div className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"> 
            <span className="w-4 h-4 rounded-full bg-blue-500 border border-white" /> **Water Storage Tanks**
          </div>
          <div className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"> 
            <span className="w-4 h-4 rounded-full bg-yellow-500 border border-white" /> **Agri Power Supply**
          </div>
          <div className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"> 
            <span className="w-4 h-4 rounded-full bg-green-500 border border-white" /> **Soil/Resource Centers**
          </div>
        </div>
    </section>
  );

  // 4. Weather Dashboard View (Applied full weather theme)
  const renderWeatherDashboard = () => {
    const alertMessage = getAlertMessage('weather');

    return (
      <section className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border border-yellow-500 dark:border-yellow-700 bg-white dark:bg-gray-800">
          
          {/* CONDITIONAL RED ALERT BANNER */}
          {alertMessage && (
            <div className="md:col-span-2 p-4 bg-red-600 text-white rounded-xl shadow-lg mb-4 text-center animate-pulse border-4 border-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => playAudio('telugu_red_alert')}>
              <p className="text-xl font-extrabold flex items-center justify-center gap-2"> <AlertTriangle className="w-6 h-6" /> {alertMessage} </p>
            </div>
          )}

          <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-yellow-600 dark:text-yellow-400 mb-6">
              <CloudRain className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              {t.weatherDashboard}
          </h2>
          
          {/* Current Conditions (Yellow/Orange Accents) */}
          <div className="p-4 mb-6 border-b-2 border-yellow-200 dark:border-yellow-700">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{t.currentConditions}</h3>
              <div className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-950 p-4 rounded-xl shadow-inner">
                <div className="text-left">
                    <p className="text-5xl font-extrabold text-yellow-600 dark:text-yellow-400">{weatherData.current.temperature}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{weatherData.current.condition}</p>
                </div>
                {getWeatherIcon(weatherData.current.condition)}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm font-medium">
                  <p><Thermometer className="inline w-4 h-4 mr-1 text-red-500" /> Feels Like: **{weatherData.current.feelsLike}**</p>
                  <p><Wind className="inline w-4 h-4 mr-1 text-sky-500" /> Wind: **{weatherData.current.wind}**</p>
                  <p><Droplet className="inline w-4 h-4 mr-1 text-blue-500" /> Humidity: **{weatherData.current.humidity}**</p>
                  <p><CloudRain className="inline w-4 h-4 mr-1 text-purple-500" /> {t.rainChance}**</p> {/* No split needed here */}
              </div>
          </div>
          
          {/* 5-Day Forecast - ADDED HOVER */}
          <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{t.fiveDayForecast}</h3>
              <div className="space-y-2">
                  {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors border border-gray-200 dark:border-yellow-800">
                          <span className="font-semibold w-1/4">{day.day}</span>
                          <span className="text-sm w-1/4 text-center">{day.condition}</span>
                          {/* FIX APPLIED HERE: Added ?. and simplified logic */}
                          <span className={`font-bold w-1/4 text-center ${day.rainChance >= 65 ? 'text-red-600 dark:text-red-400' : 'text-sky-600 dark:text-sky-400'}`}>{day.rainChance}% {t.rainChance?.split(' ')[0]}</span>
                          <span className="text-gray-700 dark:text-gray-300 w-1/4 text-right"> {day.high} / {day.low} </span>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    );
  };
  
  // 5. Agriculture Dashboard View (All accents are green/lime, hover effects added)
  const renderAgricultureDashboard = () => {
    const alertMessage = getAlertMessage('agriculture');

    return (
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CONDITIONAL RED ALERT BANNER */}
        {alertMessage && (
            <div className="md:col-span-2 p-4 bg-red-600 text-white rounded-xl shadow-lg mb-4 text-center animate-pulse border-4 border-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => playAudio('telugu_red_alert')}>
              <p className="text-xl font-extrabold flex items-center justify-center gap-2"> <AlertTriangle className="w-6 h-6" /> {alertMessage} </p>
            </div>
          )}

        {/* --- Header and Info Section (Sustainable Agriculture Guidance) --- */}
        <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border border-green-500 dark:border-green-700 bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-green-700 dark:text-green-400 mb-4">
            <Leaf className="w-7 h-7 text-green-700 dark:text-green-400" />
            {t.agriDashboard}
            {language === 'te' && <Volume2 className="w-6 h-6 ml-2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => playAudio('telugu_agri_dashboard')} />}
          </h2>
          <p className="text-md text-gray-700 dark:text-gray-300 mb-4">
            **{t.subtitle}**: Agriculture is the primary economic activity in Kantheru, Guntur district.
          </p>
        </section>

        {/* --- Government Scheme Information --- */}
        <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border border-green-300 dark:border-green-600 bg-green-50 dark:bg-gray-700">
          <h3 className="text-xl font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-4">
            <ClipboardList className="w-5 h-5 text-green-700 dark:text-green-400" /> {t.schemeInfo}
            {language === 'te' && <Volume2 className="w-5 h-5 ml-2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => playAudio('telugu_scheme_info')} />}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderCentralSchemes()}
            {renderStateSchemes()}
          </div>
        </section>
        
        {/* --- Water-Saving Tips & Awareness --- */}
        <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border border-green-300 dark:border-green-600 bg-green-50 dark:bg-gray-700">
          <h3 className="text-xl font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-4">
            <Lightbulb className="w-5 h-5 text-green-700 dark:text-green-400" /> {t.waterTips}
          </h3>
          <div className="space-y-3 text-gray-800 dark:text-gray-200">
            
            {/* Tip 1: Drip Irrigation */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold" dangerouslySetInnerHTML={{ __html: t.tip1.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                {language === 'te' && <Volume2 className="w-5 h-5 ml-2 flex-shrink-0 cursor-pointer text-green-500 hover:text-green-700" onClick={() => playAudio('telugu_tip1')} />}
              </div>
              <a href={YOUTUBE_LINKS.drip} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1 mt-1">
                <Youtube className="w-4 h-4" /> {t.viewDetails}
              </a>
            </div>

            {/* Tip 2: Rainwater Harvesting */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold" dangerouslySetInnerHTML={{ __html: t.tip2.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                {language === 'te' && <Volume2 className="w-5 h-5 ml-2 flex-shrink-0 cursor-pointer text-green-500 hover:text-green-700" onClick={() => playAudio('telugu_tip2')} />}
              </div>
              <a href={YOUTUBE_LINKS.rwh} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1 mt-1">
                <Youtube className="w-4 h-4" /> {t.viewDetails}
              </a>
            </div>
          </div>
        </section>

        {/* --- Kanteru Agricultural Profile --- */}
        <section className="p-6 rounded-2xl shadow-lg border border-green-300 dark:border-green-600 bg-green-50 dark:bg-gray-700">
          <h3 className="text-xl font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-4">
            <Zap className="w-5 h-5 text-green-700 dark:text-green-400" /> {t.agriProfile}
          </h3>
          <div className="space-y-4 text-gray-800 dark:text-gray-200">
            {/* Power Supply */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-lg text-green-600 dark:text-green-400">{t.powerSupply}</p>
              <p className="text-base">{t.powerTime}</p>
            </div>
            
            {/* Irrigation Sources */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-lg text-green-600 dark:text-green-400 mb-2">{t.irrigationSources}</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>{t.areaCanal}</li>
                <li>{t.areaTank}</li>
                <li>{t.areaBorewell}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- Land Use & Crops (Total Area: 368 Ha) --- */}
        <section className="p-6 rounded-2xl shadow-lg border border-green-300 dark:border-green-600 bg-green-50 dark:bg-gray-700">
          <h3 className="text-xl font-bold flex items-center gap-2 text-green-700 dark:text-green-400 mb-4">
            <Sprout className="w-5 h-5 text-green-700 dark:text-green-400" /> {t.landUse}
          </h3>
          <div className="space-y-4 text-gray-800 dark:text-gray-200">
            
            {/* Land Area */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-lg text-green-600 dark:text-green-400">Total Area (Village): 368 Ha</p>
              <p className="text-base">{t.totalSown}</p>
            </div>
            
            {/* Crop Seasons */}
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-lg text-green-600 dark:text-green-400 mb-2">{t.commonCrops}</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>**Kharif:** {t.cropsKharif}</li>
                <li>**Rabi:** {t.cropsRabi}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- Report Field/Crop Problem --- */}
        {renderIncidentForm('Agriculture')}
        
        {/* Simple display of recent incidents for the user (Hover added to items) */}
        <div className="md:col-span-2 mt-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t.recentIncidents}</h3>
          <div className="h-24 overflow-y-auto space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {/* Filtered to only show Agriculture incidents */}
              {incidentReports.filter(r => r.type === 'Agriculture').slice(-3).reverse().map(report => (
                  <p key={report.id} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> **{report.status} ({report.type})**: {report.description.substring(0, 50)}... ({report.reporterName}) </p>
              ))}
              {incidentReports.filter(r => r.type === 'Agriculture').length === 0 && <p className="text-center">{t.noIncidents}</p>}
          </div>
        </div>

      </div>
    );
  };
  
  // 6. Water Status Dashboard View (Hover added to info boxes and status button)
  const renderWaterStatusDashboard = () => {
    const alertMessage = getAlertMessage('dashboard');
    
    return (
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CONDITIONAL RED ALERT BANNER */}
        {alertMessage && (
          <div className="md:col-span-2 p-4 bg-red-600 text-white rounded-xl shadow-lg mb-4 text-center animate-pulse border-4 border-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => playAudio('telugu_red_alert')}>
            <p className="text-xl font-extrabold flex items-center justify-center gap-2"> <AlertTriangle className="w-6 h-6" /> {alertMessage} </p>
          </div>
        )}

        {/* --- SIMULATED UPDATE BANNER (No hover needed) --- */}
        {showWeatherUpdate && (
          <div className="md:col-span-2 p-2 bg-green-500 text-white rounded-lg shadow-md mb-2 text-center"> <p className="text-sm font-semibold">{t.updateMessage}</p> </div>
        )}
        
        {/* Village Information Section (Added hover to info items) */}
        <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-200 mb-4"> <MapIcon className="w-6 h-6" /> {t.villageInfo} </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> <Users className="w-6 h-6 text-blue-500" /> <div> <p className="text-sm text-gray-600 dark:text-gray-400">{t.population}</p> <p className="text-lg font-semibold">{t.kanteruPopulation}</p> </div> </div>
            <div className="p-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> <Home className="w-6 h-6 text-green-500" /> <div> <p className="text-sm text-gray-600 dark:text-gray-400">{t.households}</p> <p className="text-lg font-semibold">{t.kanteruHouseholds}</p> </div> </div>
            <div className="p-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> <MapPin className="w-6 h-6 text-purple-500" /> <div> <p className="text-sm text-gray-600 dark:text-gray-400">{t.nearestTown}</p> <p className="text-lg font-semibold">{t.kanteruNearestTown}</p> </div> </div>
          </div>
        </section>

        {/* Live Water Supply Status (Added hover to the status text) */}
        <section className="md:col-span-2 p-6 rounded-2xl shadow-lg border-4 border-blue-500 dark:border-blue-600">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400 mb-4"> <Droplet className="w-6 h-6" /> Live Water Supply Status </h2>
          <div className="info-box text-gray-800 dark:text-gray-200" style={{ margin: "0 auto", padding: "20px", border: "2px solid #0077b6", borderRadius: "10px", textAlign: 'center', }}>
              <p className="text-lg mb-2"><strong>{t.morningTime}</strong> {data.morningTime}</p>
              <p className="text-lg mb-2"><strong>{t.eveningTime}</strong> {data.eveningTime}</p>
              <p className="text-xl font-extrabold mb-3 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: data.status === 'available' ? '#0077b6' : '#d32f2f' }}
                onClick={() => playAudio(`telugu_status_${data.status === 'available' ? 'available' : 'scheduled'}`)}
              >
                {t.status} {data.status === 'available' ? t.available : t.scheduled}
              </p>
          </div>
          <button onClick={() => setView("adminLogin")} className="mt-6 mx-auto block py-2 px-6 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-800 transition-colors font-semibold" > {t.adminLogin} </button>
        </section>
        
        {/* --- Problem Reporting Form for Residential/Water --- */}
        {renderIncidentForm('Residential')}

      </div>
    );
  };


  // --- Main Render Logic ---
  const getCurrentView = () => {
    if (view === "map") return renderMapView();
    if (view === "weather") return renderWeatherDashboard();
    if (view === "agriculture") return renderAgricultureDashboard();
    if (view === "adminLogin") return renderAdminLogin();
    if (view === "adminDashboard") return renderAdminDashboard();
    return renderWaterStatusDashboard();
  };
  
  // Dynamic Background for the entire page (LIGHT & DARK MODE)
  const getPageBgClass = () => {
    if (view === 'agriculture') return 'bg-green-50 dark:bg-green-900'; 
    if (view === 'weather') return 'bg-yellow-50 dark:bg-yellow-900';
    if (view === 'map') return 'bg-teal-50 dark:bg-teal-900'; // Map theme background
    return 'bg-gray-50 dark:bg-gray-900'; // Default dashboard/admin background
  };

  const getHeaderBgClass = () => {
    if (view === 'agriculture') return 'bg-green-700';
    if (view === 'weather') return 'bg-yellow-600'; 
    if (view === 'map') return 'bg-teal-600'; // Map header color
    return 'bg-blue-600'; // Default is dashboard/admin
  };

  const getHeaderIcon = () => {
    if (view === 'agriculture') return <Leaf className="w-8 h-8 sm:w-10 sm:h-10" />;
    if (view === 'weather') return <CloudRain className="w-8 h-8 sm:w-10 sm:h-10" />;
    if (view === 'map') return <MapPin className="w-8 h-8 sm:w-10 sm:h-10" />; // Map header icon
    return <Droplet className="w-8 h-8 sm:w-10 sm:h-10" />;
  };


  return (
    // Apply dynamic page background class
    <div className={`min-h-screen font-sans text-gray-900 dark:text-gray-50 flex flex-col items-center p-4 sm:p-8 transition-colors ${getPageBgClass()}`}>
      <header className={`w-full max-w-4xl p-4 text-white rounded-xl shadow-lg mb-8 text-center relative transition-colors ${getHeaderBgClass()}`}>
        <div className="absolute top-4 right-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            // Dynamic language button hover/bg color
            className={`p-2 rounded-full text-white hover:opacity-90 transition-opacity cursor-pointer dark:border-none ${view === 'agriculture' ? 'bg-green-800' : view === 'weather' ? 'bg-yellow-700' : view === 'map' ? 'bg-teal-700' : 'bg-blue-700'}`}
          >
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-4">
          {getHeaderIcon()} 
          {t.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base">{t.subtitle}</p>
      </header>
      
      {/* Navigation Bar (Hover effects on all buttons) */}
      <nav className="w-full max-w-4xl mb-6 flex flex-wrap justify-center space-x-2 sm:space-x-4">
        <button
          onClick={() => { setView("dashboard"); playAudio('telugu_nav_water'); }}
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-colors ${view === "dashboard" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-800 hover:bg-blue-200 hover:text-blue-800"}`}
        >
          {t.dashboard}
        </button>
        <button
          onClick={() => { setView("agriculture"); playAudio('telugu_nav_agri'); }}
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-colors ${view === "agriculture" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800 hover:bg-green-200 hover:text-green-800"}`}
        >
          {t.agriculture}
        </button>
        <button
          onClick={() => { setView("weather"); playAudio('telugu_nav_weather'); }}
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-colors ${view === "weather" ? "bg-yellow-700 text-white" : "bg-gray-200 text-gray-800 hover:bg-yellow-200 hover:text-yellow-800"}`}
        >
          {t.weather}
        </button>
        <button
          onClick={() => { setView("map"); playAudio('telugu_nav_map'); }}
          className={`py-2 px-4 sm:px-6 rounded-full font-semibold transition-colors ${view === "map" ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-800 hover:bg-teal-200 hover:text-teal-800"}`}
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