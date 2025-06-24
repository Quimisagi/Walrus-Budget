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
  "#FF6B6B", // Soft Red
  "#FF1744", // Neon Red
  "#FF8E00", // Vivid Orange
  "#FF6D00", // Deep Orange
  "#FFD93D", // Warm Yellow
  "#00E676", // Bright Green
  "#A2D729", // Lime Green
  "#00C49A", // Teal Green
  "#00B0FF", // Vivid Blue
  "#7FBFFA", // Bright Sky Blue
  "#3D5AFE", // Indigo Blue
  "#5E35B1", // Deep Purple
  "#D500F9", // Neon Purple
  "#FF4081", // Vivid Pink
  "#FFABAB", // Pastel Red
  "#F48FB1"  // Pastel Pink
];
