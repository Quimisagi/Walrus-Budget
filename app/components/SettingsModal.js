import React, { useState } from "react";
import { router } from "expo-router"; // Will remove if not needed after refactor
import { View, Text, TouchableOpacity, Modal, StyleSheet, Button } from "react-native"; // Added Button for close
import globalStyles from "../../utils/globalStyles"; // Adjusted path
import { deleteAllData } from "../../utils/storage"; // storeData removed as it's handled by globalProvider
import { useGlobal } from "../../utils/globalProvider"; // Adjusted path
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { currency, setCurrency, language, setLanguage } = useGlobal();
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const deleteEverything = async () => {
    await deleteAllData();
    // Reset app state or navigate to initial screen might be needed.
    // For now, just close the modal. The app should react to data deletion.
    onClose(); // Close the main settings modal
    router.replace({ pathname: '/' }); // Navigate to home/initial route
  };

  const changeCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    setCurrencyModalVisible(false); // Close currency picker modal
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setLanguageModalVisible(false); // Close language picker modal
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ja', name: '日本語' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={[globalStyles.h2, { marginBottom: 20 }]}>{t('settings.title')}</Text>

          {/* Currency Selector */}
          <View style={[globalStyles.row, styles.settingItem]}>
            <Text style={globalStyles.h3}>{t('settings.currency')}: </Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setCurrencyModalVisible(true)}>
              <Text style={styles.dropdownButtonText}>{currency} ▼</Text>
            </TouchableOpacity>
          </View>

          <Modal transparent={true} visible={currencyModalVisible} animationType="fade" onRequestClose={() => setCurrencyModalVisible(false)}>
            <TouchableOpacity style={styles.pickerModalOverlay} onPress={() => setCurrencyModalVisible(false)}>
              <View style={styles.pickerModalContent}>
                {['USD', 'YEN', 'EUR'].map((curr) => (
                  <TouchableOpacity key={curr} style={styles.option} onPress={() => changeCurrency(curr)}>
                    <Text style={styles.optionText}>{curr}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Language Selector */}
          <View style={[globalStyles.row, styles.settingItem]}>
            <Text style={globalStyles.h3}>{t('settings.language')}: </Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setLanguageModalVisible(true)}>
              <Text style={styles.dropdownButtonText}>{languages.find(l => l.code === language)?.name || language} ▼</Text>
            </TouchableOpacity>
          </View>

          <Modal transparent={true} visible={languageModalVisible} animationType="fade" onRequestClose={() => setLanguageModalVisible(false)}>
            <TouchableOpacity style={styles.pickerModalOverlay} onPress={() => setLanguageModalVisible(false)}>
              <View style={styles.pickerModalContent}>
                {languages.map((lang) => (
                  <TouchableOpacity key={lang.code} style={styles.option} onPress={() => changeLanguage(lang.code)}>
                    <Text style={styles.optionText}>{lang.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          <TouchableOpacity style={styles.deleteButton} onPress={deleteEverything}>
            <Text style={styles.deleteButtonText}>{t('settings.deleteEverything')}</Text>
          </TouchableOpacity>

          <Button title={t('general.close')} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)', // Dimmed background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%'
  },
  settingItem: {
    marginBottom: 20,
    alignItems: 'center'
  },
  deleteButton: {
    backgroundColor: '#FEC8C3', // Consider using a global style or theme color
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%'
  },
  deleteButtonText: {
    color: '#FB5A4B', // Consider using a global style or theme color
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 150, // Or adjust as needed
    alignItems: 'center',
    marginLeft: 10 // Added margin for spacing from label
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  // Styles for the picker modals (currency/language)
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Slightly lighter overlay for nested modals
  },
  pickerModalContent: {
    backgroundColor: 'white',
    marginHorizontal: 50, // Smaller margin for picker modals
    borderRadius: 8,
    padding: 10,
  },
  option: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  optionText: {
    fontSize: 16,
  },
});

export default SettingsModal;
