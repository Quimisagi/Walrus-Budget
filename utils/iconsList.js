import { 
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Entypo
} from '@expo/vector-icons';


const getBrightness = (color) => {
  // Convert hex color to RGB
  const rgb = parseInt(color.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  // Calculate brightness using the formula (0.299 * R + 0.587 * G + 0.114 * B)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

export const getContrastColor = (color) => {
  return getBrightness(color) < 0.5 ? '#ffffff' : 'black'; };


export const icons = [
  "star",
  "heart",
  "house",
  "credit-card",
  "cart-shopping",
  "car",
  "gift",
  "bowl-food",
  "mug-saucer",
  "seedling",
  "plane",
  "book",
  "wine-bottle",
  "music",
  "gamepad",
  "film",
  "futbol",
  "burger",
  "glass-water",
  "cloud",
  "bone",
  "cat",
  "dog",
  "paw",
  "tree",
  "umbrella",
  "cloud-sun",
  "vault",
  "coins",
  "cloud-moon",
  "piggy-bank",
  "scale-balanced",
  "wallet",
  "briefcase",
  "cash-register",
  "landmark",
  "store",
  "graduation-cap",
  "paperclip",
  "pen",
  "bed",
  "briefcase-medical",
  "trash",
  "camera",
  "mobile",
  "dumbbell",
  "bicycle",
  "desktop",
  "guitar",
  "train",
  "shirt",
  "scissors",
  "lightbulb",
  "bolt",
  "hotel"
];

export const colors = [
  "#2F2A2A",
  "#800000", // Maroon
  "#DC143C", // Crimson
  "#FF5733", // Reddish Orange
  "#FF8C00", // Dark Orange
  "#FFD700", // Gold
  "#ADFF2F", // Green Yellow
  "#32CD32", // Lime Green
  "#073B11",
  "#00FFFF", // Cyan
  "#3366FF", // Vivid Blue
  "#FF69B4", // Hot Pink
  "#9661DC", // Medium Purple
  "#BCBDBF"
]

