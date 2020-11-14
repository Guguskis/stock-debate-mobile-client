import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screen/LoginScreen";
import RegistrationScreen from "./screen/RegistrationScreen";

const Stack = createStackNavigator();

const Index = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Index;