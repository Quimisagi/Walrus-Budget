import React from "react";
import { router} from "expo-router";
import {View, Text, Button} from "react-native";
import globalStyles from "../utils/globalStyles";
import { deleteAllData, storeData } from "../utils/storage";

const Settings = () => {

  const deleteEverything = async () => {
    await deleteAllData();
    router.replace({pathname: '/'});
  }

  const changeCurrency = (currency) => {
    storeData('currency', currency);
    router.replace({ pathname: '/' });
  }


  return (
    <View style={globalStyles.container}>
      <Button title="DELETE EVERYTHING" onPress={deleteEverything}></Button>
      <Button title="USD" onPress={() => changeCurrency('USD')}></Button>
      <Button title="YEN" onPress={() => changeCurrency('YEN')}></Button>
    </View>
  )
}
export default Settings;

