import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screen/LoginScreen";
import RegistrationScreen from "./screen/RegistrationScreen";
import HomeScreen from "./screen/HomeScreen";
import ForecastsScreen from "./screen/ForecastsScreen";
import ForecastsResultScreen from "./screen/ForecastsResultScreen";

const Stack = createStackNavigator();

const Index = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Forecasts" component={ForecastsScreen} />
                <Stack.Screen name="ForecastsResults" component={ForecastsResultScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Index;