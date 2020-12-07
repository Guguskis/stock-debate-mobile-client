import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../common/Button";
import properties from "../properties/properties";
import Title from "../common/Title";

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.activity}>

            <Title style={styles.title} text="StockDebate" />
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("Forecasts")}
                    text="Forecasts" />

                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("SubredditOpinion")}
                    text="Opinions" />

                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("Trending")}
                    text="Trending" />
            </View>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    button: {
        width: 250,
        height: 50,
        margin: 5
    },
    activity: {
        flex: 1,
        alignItems: "center",
        backgroundColor: properties.color.background,
    },
    buttonContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },
    title: {
        marginBottom: 200
    }
});