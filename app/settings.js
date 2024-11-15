import React from "react";
import { router} from "expo-router";
import {View, Text, Button} from "react-native";
import globalStyles from "../utils/globalStyles";
import { deleteAllData } from "../utils/storage";

const Settings = () => {

  const deleteEverything = async () => {
    await deleteAllData();
    router.replace({pathname: '/'});
  }

  return (
    <View style={globalStyles.container}>
      <Button title="DELETE EVERYTHING" onPress={deleteEverything}></Button>
    </View>
  )
}
export default Settings;

