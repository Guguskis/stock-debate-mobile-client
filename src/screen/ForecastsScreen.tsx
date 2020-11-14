import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../common/Button";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";


const ForecastsScreen = () => {
    const navigation = useNavigation();
    const [{ data: forecastData, loading: forecastLoading, error: forecastError }, forecastExecute] = useAxios(
        {
            url: `${properties.url.autentification}/api/user`, // todo change url
            method: 'POST'
        },
        { manual: true }
    )

    const [username, setUsername] = useState("");

    const analyse = async () => {

        if (!inputFieldsAreValid()) {
            let errorMessage = getInputFieldValidationMessage();
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            return;
        }

        try {
            // await forecastExecute(request);
            ToastAndroid.show("Registration successful", ToastAndroid.SHORT);
            navigation.navigate("ForecastsResults", {
                forecasts: [
                    {
                        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg",
                        symbol: "AMD",
                        price: 83.15,
                        createdDate: "2021-01-01",
                        expirationDate: "2021-01-05",
                        type: "CALL",
                        targetPrice: 95,
                        successCoefficient: 13
                    }
                ]
            });
        } catch (err) {
            let errorMessage = forecastError?.response?.data;
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
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
                <Button
                    style={styles.button}
                    onPress={analyse}
                    text="Analyse" />
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
        alignItems: "flex-end"
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