import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../../utils/globalStyles'; // Assuming you have global styles

const ConfirmBudgetNameModal = ({ isVisible, onClose, onConfirm, initialName }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleConfirm = () => {
    if (name.trim() === '') {
      // Optionally, show an alert or prevent confirmation if the name is empty
      alert("Budget name cannot be empty.");
      return;
    }
    onConfirm(name);
    onClose(); // Close modal after confirmation
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
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
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
    flex: 1, // Make buttons take equal width
    marginHorizontal: 5, // Add some space between buttons
    alignItems: 'center', // Center text in button
  },
  confirmButton: {
    backgroundColor: '#4CAF50', // Green for confirm
  },
  cancelButton: {
    backgroundColor: '#f44336', // Red for cancel
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ConfirmBudgetNameModal;
