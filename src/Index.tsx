import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screen/LoginScreen";
import RegistrationScreen from "./screen/RegistrationScreen";
import HomeScreen from "./screen/HomeScreen";
import ForecastsScreen from "./screen/ForecastsScreen";
import ForecastsResultScreen from "./screen/ForecastsResultScreen";
import { StyleSheet } from "react-native";
import properties from "./properties/properties";
import SubredditOpinionScreen from "./screen/SubredditOpinionScreen";
import SubredditOpinionResultsScreen from "./screen/SubredditOpinionResultsScreen";

const Stack = createStackNavigator();

const Index = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerStyle: styles.header,
                title: "",
                headerTintColor: 'white'
            }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Forecasts" component={ForecastsScreen} />
                <Stack.Screen name="ForecastsResults" component={ForecastsResultScreen} />
                <Stack.Screen name="SubredditOpinion" component={SubredditOpinionScreen} />
                <Stack.Screen name="SubredditOpinionResults" component={SubredditOpinionResultsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Index;


const styles = StyleSheet.create({
    header: {
        backgroundColor: properties.color.background
    }
})