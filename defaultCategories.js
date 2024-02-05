import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const ICON_SIZE = 24; 

const defaultCategories = [
  {
    name: 'Food',
    color: '#55efc4',
    id: "0",
    icon: <MaterialCommunityIcons name="food" size={ICON_SIZE} color="black" />
  },
  {
    name: 'Housing',
    color: '#81ecec',
    id: "1",
    icon:  <Ionicons name="home-sharp" size={ICON_SIZE} color="black" />
    },
  {
    name: 'Transportation',
    color: '#74b9ff',
    id: "2",
    icon: <MaterialCommunityIcons name="car" size={ICON_SIZE} color="black" />
  },
  {
    name: 'Entertainment',
    color: '#a29bfe',
    id: "3",
    icon: <Entypo name="game-controller" size={ICON_SIZE} color="black" />
  },
  {
    name: 'Shopping',
    color: '#ffeaa7',
    id: "4",
    icon: <MaterialCommunityIcons name="shopping" size={ICON_SIZE} color="black" /> 
    },
  {
    name: 'Health',
    color: '#fab1a0',
    id: "5",
    icon: <Entypo name="heart" size={ICON_SIZE} color="black" />
  },
]; 
export default defaultCategories;
