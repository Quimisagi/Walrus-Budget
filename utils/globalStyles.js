import {StyleSheet} from 'react-native';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';

Font.loadAsync({
  'PlusJakarta': require('../assets/fonts/PlusJakartaSans.ttf'),
  'Poppins': require('../assets/fonts/Poppins-SemiBold.ttf'),
});

const globalStyles = StyleSheet.create({
  h1: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: 'red',
  },
  h2: {
    fontSize: 17,
    fontFamily: 'Poppins',
  },
  h3: {
    fontSize: 14,
    fontFamily: 'PlusJakarta',
  },
  amount: {
    fontSize: 18,
    fontFamily: 'PlusJakarta',
  },
  text: {
    fontSize: 12,
    fontFamily: 'PlusJakarta',
  },
  secondaryText: {
    fontSize: 12,
    fontFamily: 'PlusJakarta',
    color: '#9095a0',
  },
    transactionContainer: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  label: {
    fontSize: 12,
    fontFamily: 'PlusJakarta',
    marginBottom: 5,
    marginTop: 5,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
  },
  balance: {
    fontSize: 48,
    fontFamily: 'PlusJakarta',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    margin: 5,
    padding: 5,
  },
  container:{
    marginTop: 65,
    padding: 30,
    flex: 1
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    margin: 12,
  },
  hr: {
    borderBottomColor: '#bcc1ca',
    borderBottomWidth: 1,
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 5,
  },
  inputFieldLabel: {
    fontSize: 16,
    fontFamily: 'PlusJakarta',
    marginBottom: 5,
  },
  inputFieldContainer: {
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'PlusJakarta',
  },
  inputField: {
    textAlign: 'left',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'PlusJakarta',
    color: 'black',
  },
  dateLabel:{
    fontSize: 16,
    fontFamily: 'PlusJakarta',
    paddingTop: 4,
  },
  inputFieldB: {
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 32,
    fontFamily: 'PlusJakarta',
    marginBottom: 20,
    marginTop: 20,
  },
  inputFieldBInvisible: {
    textAlign: 'center',
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 32,
    fontFamily: 'PlusJakarta',
    marginBottom: 20,
    marginTop: 20,
    opacity: 0,
    position: 'absolute',
  },
  buttonA: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F3FF',
    padding: 5,
    margin: 5,
    borderRadius: 10,
    width: '95%',
  },
  buttonAText: {
    fontFamily: 'PlusJakarta',
    color: '#379ae6',
    fontSize: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#447ae3',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  actionButtonText: {
    fontFamily: 'PlusJakarta',
    color: '#ffffff',
    fontSize: 16,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10, 
    padding: 30,
  },
  expense: {
    color: '#FB5A4B',
    fontSize: 14,
    fontFamily: 'PlusJakarta',
  },
  income: {
    color: '#1C9B4F',
    fontSize: 14,
    fontFamily: 'PlusJakarta',
  },
  addButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#00A5E0',
    borderRadius: 40, 
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    marginTop: 20,
  },
  mainActionButton: {
    backgroundColor: '#D6F4FF',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    height: 50,
  },
  mainActionButtonText: {
    marginTop: 4,
    color: '#00A5E0',
  },
  cancelButton: {
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    height: 50,
  },
  cancelButtonText: {
    marginTop: 4,
    color: '#000000',
  },
  confirmButton: {
    backgroundColor: '#00A5E0',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    height: 50,
  },
  confirmButtonText: {
    marginTop: 4,
    color: '#FFFFFF',
  },


});

export default globalStyles;
