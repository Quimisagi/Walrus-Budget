import { 
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Entypo
} from '@expo/vector-icons';

const iconDirectoryPath = '../assets/icons';

export const loadIcons = async () => {
    try {
      const iconFiles = await require.context(iconDirectoryPath, false, /\.(svg)$/);
      return iconFiles.keys().map((iconPath) => iconPath);
    } catch (error) {
      console.error('Error loading icons:', error);
      return null;
    }
  };

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
  '#81ecec',
  '#a29bfe',
  '#faea50',
  '#fab0af',
  '#b44fff',
  '#a03',
  '#4fa344',
  '#e33',
  '#000f0f',
  '#3aa',
  '#d60000',
  '#0625dd'
]

