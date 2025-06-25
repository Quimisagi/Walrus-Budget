import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import globalStyles from "../utils/globalStyles";
import { deleteAllData, storeData } from "../utils/storage"; // storeData might not be needed if language is handled by globalProvider
import { useGlobal } from "../utils/globalProvider";
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();
  const { currency, setCurrency, language, setLanguage } = useGlobal(); // Get language and setLanguage from global context
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);


  const deleteEverything = async () => {
    await deleteAllData();
    // It's good practice to also reset language to default or clear it from storage if needed
    // For now, we'll let it persist as per current plan.
    router.replace({ pathname: '/' });
  };

  const changeCurrency = async (newCurrency) => {
    // setSelectedCurrency(currency); // Not needed as currency comes from global state
    // await storeData('currency', currency); // This is handled by globalProvider or should be if not already
    setCurrency(newCurrency); // Update global currency state
    // router.replace({ pathname: '/' }); // Might not be necessary to reload the entire app, depends on how currency is used
  };

  const changeLanguage = (lang) => {
    setLanguage(lang); // Update global language state, which also updates i18n and AsyncStorage
    // router.replace({ pathname: '/' }); // May not be needed if components re-render correctly
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ja', name: '日本語' },
  ];

  return (
    <View style={globalStyles.container}>
      {/* Currency Selector */}
      <View style={[ globalStyles.row, {marginBottom: 20} ]}>
        <Text style={globalStyles.h3}>{t('settings.currency')}: </Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setCurrencyModalVisible(true)}>
          <Text style={styles.dropdownButtonText}>{currency} ▼</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={currencyModalVisible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setCurrencyModalVisible(false)}>
          <View style={styles.modalContent}>
            {['USD', 'YEN', 'EUR'].map((curr) => (
              <TouchableOpacity key={curr} style={styles.option} onPress={() => { changeCurrency(curr); setCurrencyModalVisible(false); }}>
                <Text style={styles.optionText}>{curr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Language Selector */}
      <View style={[ globalStyles.row, {marginBottom: 20} ]}>
        <Text style={globalStyles.h3}>{t('settings.language')}: </Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setLanguageModalVisible(true)}>
          <Text style={styles.dropdownButtonText}>{languages.find(l => l.code === language)?.name} ▼</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={languageModalVisible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setLanguageModalVisible(false)}>
          <View style={styles.modalContent}>
            {languages.map((lang) => (
              <TouchableOpacity key={lang.code} style={styles.option} onPress={() => { changeLanguage(lang.code); setLanguageModalVisible(false); }}>
                <Text style={styles.optionText}>{lang.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteEverything}>
        <Text style={styles.deleteButtonText}>{t('settings.deleteEverything')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#FEC8C3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FB5A4B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    marginHorizontal: 10
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000066',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 40,
    borderRadius: 8,
    padding: 10,
  },
  option: {
    padding: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});

export default Settings;
