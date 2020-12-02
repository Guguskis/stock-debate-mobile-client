import React, { useState } from "react";
import { Text, View, StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";

import Button from "../common/Button";
import properties from "../properties/properties";

const ForecastsScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState("");

    const [{ loading: forecastLoading }, forecastsExecute] = useAxios(
        {
            url: `${properties.url.stockDebateApi}/api/${username}/forecasts`,
            method: 'GET'
        },
        { manual: true }
    )

    const retrieveForecasts = async () => {

        if (!inputFieldsAreValid()) {
            let errorMessage = getInputFieldValidationMessage();
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            return;
        }

        try {
            const { data: redditUser } = await forecastsExecute();

            navigation.navigate("ForecastsResults", {
                redditUser: redditUser
            });
        } catch (err) {
            let errorMessage = err?.response?.data;
            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        }

    }

    const inputFieldsAreValid = () => {
        return getInputFieldValidationMessage() == "";
    }

    const getInputFieldValidationMessage = () => {
        let errorMessage = "";

        if (username == "") {
            errorMessage = "Enter username";
        }

        return errorMessage;
    }

    return (
        <View style={styles.activity}>

            <Text style={styles.inputLabel}>
                Username
            </Text>
            <TextInput
                style={styles.inputField}
                onChangeText={setUsername}
                value={username}
            />
            <View style={styles.buttonContainer}>
                {forecastLoading ?
                    <ActivityIndicator
                        color={properties.color.primary}
                        size={50}
                        style={{ marginRight: 50 }} />
                    :
                    <Button
                        style={styles.button}
                        onPress={retrieveForecasts}
                        text="Analyse" />
                }
            </View>
        </View>
    );
}

export default ForecastsScreen;

const styles = StyleSheet.create({
    button: {
        width: 150,
        height: 50
    },
    activity: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: properties.color.background,
        padding: 25
    },
    buttonContainer: {
        alignItems: "flex-end",
    },
    inputLabel: {
        fontSize: properties.font.size.medium,
        color: properties.color.text
    },
    inputField: {
        height: 50,
        borderColor: "black",
        borderWidth: 1,
        fontSize: properties.font.size.medium,
        backgroundColor: properties.color.primary,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    }
});