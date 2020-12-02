import React, { useState } from "react";
import { Text, View, StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";

import Button from "../common/Button";
import properties from "../properties/properties";
import DropDownPicker from "react-native-dropdown-picker";

const marshallToDropdownFormat = (names: Array<String>) => {
    return names.map(name => {
        const label = name[0].toUpperCase() + name.substring(1, name.length);
        return { label: label, value: name };
    })
}

const SubredditOpinionScreen = () => {
    const navigation = useNavigation();

    const [stock, setStock] = useState("");
    const [selectedSubreddit, setSelectedSubreddit] = useState("");
    const [availableSubreddits, setAvailableSubreddits] = useState([
        "investing", "wallstreetbets"
    ])

    const [{ loading: forecastLoading }, forecastsExecute] = useAxios(
        {
            url: `${properties.url.stockDebateApi}/api/${selectedSubreddit}/forecasts`,
            method: 'GET'
        },
        { manual: true }
    )

    const retrieveOpinions = async () => {

        if (!inputFieldsAreValid()) {
            let errorMessage = getInputFieldValidationMessage();
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            return;
        }

        try {
            const { data: redditUser } = await forecastsExecute();

            console.log("Retrieved opinions")

            // navigation.navigate("ForecastsResults", {
            //     redditUser: redditUser
            // });
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

        if (selectedSubreddit == "") {
            errorMessage = "Select subreddit";
        }

        return errorMessage;
    }

    return (
        <View style={styles.activity}>

            <Text style={styles.inputLabel}>Subreddit</Text>
            <DropDownPicker
                style={styles.subredditSelector}
                itemStyle={styles.subredditSelectorItem}
                labelStyle={styles.subredditSelectorFont}
                dropDownStyle={styles.subredditSelectorDropdown}
                containerStyle={styles.subredditSelectorContainer}
                items={marshallToDropdownFormat(availableSubreddits)}
                placeholder="Select subreddit"
                defaultValue={selectedSubreddit}
                onChangeItem={item => setSelectedSubreddit(item.value)} />

            <Text style={styles.inputLabel}>Stock</Text>
            <TextInput
                style={styles.inputField}
                onChangeText={setStock}
                value={stock}
                placeholder="Optional" />

            <View style={styles.buttonContainer}>
                {forecastLoading ?
                    <ActivityIndicator
                        color={properties.color.primary}
                        size={50}
                        style={{ marginRight: 50 }} />
                    :
                    <Button
                        style={styles.button}
                        onPress={retrieveOpinions}
                        text="Analyse" />
                }
            </View>
        </View>
    );
}

export default SubredditOpinionScreen;

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
    },
    subredditSelector: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: properties.color.primary,
    },
    subredditSelectorContainer: {
        height: 50,
    },
    subredditSelectorFont: {
        fontSize: properties.font.size.medium
    },
    subredditSelectorItem: {
        justifyContent: 'flex-start',
        backgroundColor: properties.color.primary,
    },
    subredditSelectorDropdown: {
        backgroundColor: properties.color.primary,
        borderColor: 'black',
    },
});