import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ToastAndroid, ActivityIndicator, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import useAxios from "axios-hooks";

import Button from "../common/Button";
import properties from "../properties/properties";
import DropDownPicker from "react-native-dropdown-picker";

const marshallToDropdownFormat = (names: Array<String>) => {
    const items = names.map(name => {
        const upperFirstChar = name[0].toUpperCase();
        const remainingChars = name.substring(1, name.length);
        const label = upperFirstChar + remainingChars;
        return { label: label, value: name };
    })

    items.unshift({ label: "All", value: "" })

    return items
}

const TrendingScreen = () => {
    const navigation = useNavigation();

    const [selectedSubreddit, setSelectedSubreddit] = useState("");
    const [availableSubreddits, setAvailableSubreddits] = useState([]);

    const [{ data: subredditsData }] = useAxios(`${properties.url.community}/api/subreddits`);
    const [{ loading: getTrendsLoading }, getTrends] = useAxios(
        {
            url: `${properties.url.community}/api/trends`,
            params: { subreddit: selectedSubreddit },
            method: 'GET'
        },
        { manual: true }
    )

    useEffect(() => {
        if (subredditsData) {
            const subreddits = subredditsData.map(subreddit => subreddit.name);
            setAvailableSubreddits(subreddits);
        }
    }, [subredditsData])

    const retrieveOpinions = async () => {

        try {
            const { data: trends } = await getTrends();

            navigation.navigate("TrendingResults", {
                subreddit: selectedSubreddit,
                trends: trends
            });

        } catch (err) {
            let errorMessage = err?.response?.data;
            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        }
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

            <View style={styles.buttonContainer}>
                {getTrendsLoading ?
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

export default TrendingScreen;

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