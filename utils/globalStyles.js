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
    marginTop: 20,
    marginBottom: 20,
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
    fontSize: 16,
    fontFamily: 'PlusJakarta',
    marginBottom: 5,
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
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    margin: 5,
    padding: 10,
  },
  container:{
    marginTop: 75,
    padding: 20,
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
  inputField: {
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'PlusJakarta',
  },
  dateLabel:{
    fontSize: 16,
    fontFamily: 'PlusJakarta',
    paddingTop: 4,
  },
  inputFieldB: {
    textAlign: 'center',
    borderWidth: 0.5,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 32,
    fontFamily: 'PlusJakarta',
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
    padding: 20,
  },
  expense: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'PlusJakarta',
  },
  income: {
    color: 'green',
    fontSize: 14,
    fontFamily: 'PlusJakarta',
  },
});

export default globalStyles;
