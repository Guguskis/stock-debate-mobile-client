import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ToastAndroid } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Button from "../common/Button";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";


const ForecastsResultScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [forecasts, setForecasts] = useState<Array<Object>>(route.params?.forecasts);

    return (
        <View style={styles.activity}>

            <Text style={styles.inputLabel}>
                {forecasts[0].symbol}
            </Text>
        </View>
    );
}

export default ForecastsResultScreen;

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