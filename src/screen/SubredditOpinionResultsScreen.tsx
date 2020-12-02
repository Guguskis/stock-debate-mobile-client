import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../common/Button";
import properties from "../properties/properties";
import Title from "../common/Title";

const SubredditOpinionResultsScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.activity}>

            <Title style={styles.title} />
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("Forecasts")}
                    text="Forecasts" />

            </View>
        </View>
    );
}

export default SubredditOpinionResultsScreen;

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