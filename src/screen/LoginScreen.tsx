import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../common/Button";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";


const LoginScreen = () => {
    const navigation = useNavigation();

    const [{ data: loginData, loading: loginLoading, error: loginError }] = useAxios(
        {
            url: `${properties.url.autentification}/api/user`, // change to login
            method: 'POST'
        },
        { manual: true }
    )

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

    }
    const register = () => {

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

            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    onPress={login}
                    text="Login" />
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
        marginBottom: 10
    }
});