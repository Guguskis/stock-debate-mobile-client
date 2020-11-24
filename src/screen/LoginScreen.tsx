import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../common/Button";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";
import { GLOBAL } from "../properties/globalState";


const LoginScreen = () => {
    const navigation = useNavigation();

    const [username, setUsername] = useState("Mataz");
    const [password, setPassword] = useState("10101010");


    const [{ error: loginError }, loginExecute] = useAxios(
        {
            url: `${properties.url.autentification}/api/user/login`,
            method: 'POST'
        },
        { manual: true }
    )

    const [{ loading: userLoading }, userExecute] = useAxios(
        {
            url: `${properties.url.autentification}/api/user/${username}`,
            method: 'GET'
        },
        { manual: true }
    )

    const login = async () => {
        let request = {
            data: {
                username: username,
                password: password
            }
        };

        try {
            const { data: loginData } = await loginExecute(request);

            if (loginData.canLogin) {
                const { data: userData } = await userExecute();
                GLOBAL.USER.id = userData.id;
                GLOBAL.USER.username = userData.username;
                navigation.navigate("Home");
            } else {
                ToastAndroid.show("Incorrect username or password", ToastAndroid.SHORT);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {

    }, [])

    const register = () => {
        navigation.navigate("Registration");
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
        padding: 25
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