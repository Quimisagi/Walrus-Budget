import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../../utils/globalStyles'; // Assuming you have global styles
import { useTranslation } from 'react-i18next';

const ConfirmBudgetNameModal = ({ isVisible, onClose, onConfirm, initialName }) => {
  const [name, setName] = useState(initialName);
  const { t } = useTranslation();


  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleConfirm = () => {
    if (name.trim() === '') {
      alert("Budget name cannot be empty.");
      return;
    }
    onConfirm(name);
    onClose(); 
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={globalStyles.h3}>Set New Budget Name</Text>
          <TextInput
            style={[globalStyles.inputField, styles.input]}
            placeholder="Enter budget name"
            value={name}
            onChangeText={setName}
            autoFocus={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>{t('general.cancel_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.buttonText1}>{t('general.confirm_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginVertical: 20,
    borderWidth: 1, // Ensure input field is visible
    borderColor: 'gray', // Ensure input field is visible
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#00A5E0',
  },
  cancelButton: {
    backgroundColor: '#E6E6E6',
  },
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ConfirmBudgetNameModal;
