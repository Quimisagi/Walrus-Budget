import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import globalStyles from "../utils/globalStyles";
import { deleteAllData, storeData } from "../utils/storage";
import { useGlobal } from "../utils/globalProvider";

const Settings = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [modalVisible, setModalVisible] = useState(false);

  const deleteEverything = async () => {
    await deleteAllData();
    router.replace({ pathname: '/' });
  };

  const changeCurrency = async (currency) => {
    setSelectedCurrency(currency);
    await storeData('currency', currency);
    router.replace({ pathname: '/' });
  };

  return (
    <View style={globalStyles.container}>
      <View style={[ globalStyles.row, {marginBottom: 20} ]}>
        <Text style={globalStyles.h3}>Currency: </Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownButtonText}>{selectedCurrency} ▼</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {['USD', 'YEN', 'EUR'].map((currency) => (
              <TouchableOpacity key={currency} style={styles.option} onPress={() => { changeCurrency(currency); setModalVisible(false); }}>
                <Text style={styles.optionText}>{currency}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity style={styles.deleteButton} onPress={deleteEverything}>
        <Text style={styles.deleteButtonText}>DELETE EVERYTHING</Text>
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
