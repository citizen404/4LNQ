export const airportCodes = [
    "JFK - New York, USA 🇺🇸",
    "ORD - Chicago, USA 🇺🇸",
    "LAX - Los Angeles, USA 🇺🇸",
    "DXB - Dubai, UAE 🇦🇪",
    "LHR - London, UK 🇬🇧",
    "CDG - Paris, France 🇫🇷",
    "AMS - Amsterdam, Netherlands 🇳🇱",
    "FRA - Frankfurt, Germany 🇩🇪",
    "HND - Tokyo, Japan 🇯🇵",
    "SYD - Sydney, Australia 🇦🇺",
    "SIN - Singapore, Singapore 🇸🇬",
    "BCN - Barcelona, Spain 🇪🇸",
    "FCO - Rome, Italy 🇮🇹",
    "IST - Istanbul, Turkey 🇹🇷",
    "MOW - Moscow, Russia"
];

export const airportsByCountry = {
    USA: [
        { code: "JFK", name: "New York 🇺🇸" },
        { code: "ORD", name: "Chicago 🇺🇸" },
        { code: "LAX", name: "Los Angeles 🇺🇸" }
    ],
    UAE: [
        { code: "DXB", name: "Dubai 🇦🇪" },
        { code: "AUH", name: "Abu-Dhabi 🇦🇪" }
    ],
    UK: [
        { code: "LHR", name: "London 🇬🇧" }
    ],
    France: [
        { code: "CDG", name: "Paris 🇫🇷" }
    ],
    Netherlands: [
        { code: "AMS", name: "Amsterdam 🇳🇱" }
    ],
    Germany: [
        { code: "FRA", name: "Frankfurt 🇩🇪" }
    ],
    Japan: [
        { code: "HND", name: "Tokyo 🇯🇵" }
    ],
    Australia: [
        { code: "SYD", name: "Sydney 🇦🇺" }
    ],
    Singapore: [
        { code: "SIN", name: "Singapore 🇸🇬" }
    ],
    Spain: [
        { code: "BCN", name: "Barcelona 🇪🇸" }
    ],
    Italy: [
        { code: "FCO", name: "Rome 🇮🇹" }
    ],
    Turkey: [
        { code: "IST", name: "Istanbul 🇹🇷" }
    ],
    Russia: [
        { code: "MOW", name: "Moscow 🇷🇺" }
    ]
};

export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};