/* eslint-disable react/style-prop-object */
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Home } from "./src/pages/home";

export default function App() {
   return (
      <NavigationContainer>
         <NativeBaseProvider>
            <View style={{ flex: 1 }}>
               <StatusBar style="dark" hidden />
               <Home />
            </View>
         </NativeBaseProvider>
      </NavigationContainer>
   );
}
