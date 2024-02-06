import {StyleSheet} from 'react-native';
import './fonts/Outfit-VariableFont_wght.ttf';

const globalStyles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontFamily: 'Outfit',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  h2: {
    fontSize: 20,
    fontFamily: 'Outfit',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  h3: {
    fontSize: 16,
    fontFamily: 'Outfit',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Outfit',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit',
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    margin: 5,
    padding: 10,
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
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
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
    fontFamily: 'Outfit',
    marginBottom: 5,
  },
  inputField: {
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'Outfit',
  },
  dateLabel:{
    fontSize: 16,
    fontFamily: 'Outfit',
    paddingTop: 4,
  },
  inputFieldB: {
    textAlign: 'center',
    borderColor: 'blue',
    borderWidth: 0.5,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 32,
    fontFamily: 'Outfit',
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
    fontFamily: 'Outfit',
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
    fontFamily: 'Outfit',
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
});

export default globalStyles;
