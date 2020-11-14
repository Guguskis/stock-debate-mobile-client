import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../common/Button";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";


const LoginScreen = () => {
    const navigation = useNavigation();

    const [{ data: registerData, loading: registerLoading, error: registerError }, registerExecute] = useAxios(
        {
            url: `${properties.url.autentification}/api/user`,
            method: 'POST'
        },
        { manual: true }
    )

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");


    const register = async () => {

        if (!inputFieldsAreValid()) {
            let errorMessage = getInputFieldValidationMessage();
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            return;
        }

        let request = {
            data: {
                username: username,
                password: password
            }
        };

        try {
            await registerExecute(request);
            ToastAndroid.show("Registration succseful", ToastAndroid.SHORT);
            navigation.navigate("Login");
        } catch (err) {
            let errorMessage = registerError?.response?.data;
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
        } else if (password.length < 8) {
            errorMessage = "Password must be at least 8 symbols";
        } else if (password != repeatPassword) {
            errorMessage = "Passwords don't match";
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

            <Text style={styles.inputLabel}>
                Password
            </Text>
            <TextInput
                style={styles.inputField}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
            />

            <Text style={styles.inputLabel}>
                Repeat password
            </Text>
            <TextInput
                style={styles.inputField}
                onChangeText={setRepeatPassword}
                value={repeatPassword}
                secureTextEntry={true}
            />

            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    onPress={register}
                    text="Register" />
            </View>
        </View>
    );
}

export default LoginScreen;

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
        padding: 5
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row-reverse",
        justifyContent: "space-around"
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