import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const navigation = useNavigation();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>
        Welcome to the top logistics services provided by the Chas Advance team!
        <Button title="Log in" onPress={() => navigation.navigate("Login")} />
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
