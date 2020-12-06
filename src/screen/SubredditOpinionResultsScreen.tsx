import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { StackedAreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import Button from "../common/Button";
import properties from "../properties/properties";
import Title from "../common/Title";
import useOpinionsRetriever from "../helpers/useOpinionsRetriever";

const SubredditOpinionResultsScreen = () => {
    const route = useRoute();

    const { subreddit, stock, dateRange, opinionsDetails, updateOpinions }
        = useOpinionsRetriever(
            route?.params.subreddit,
            route?.params.stock.symbol,
            "DAY"
        );

    const colors = ['#ff0000', '#00ff00', '#333333']
    const keys = ['sellCount', 'buyCount', 'neutralCount']

    return (
        <View style={styles.activity}>
            <Title style={styles.title} />

            <StackedAreaChart
                style={styles.chart}
                data={opinionsDetails}
                keys={keys}
                colors={colors}
                curve={shape.curveNatural}
                showGrid={false}
            />
            <Button text="D" onPress={() => updateOpinions(subreddit, stock, "DAY")} />
            <Button text="W" onPress={() => updateOpinions(subreddit, stock, "WEEK")} />
            <Button text="1M" onPress={() => updateOpinions(subreddit, stock, "MONTH")} />
            <Button text="3M" onPress={() => updateOpinions(subreddit, stock, "THREE_MONTHS")} />
            <Button text="6M" onPress={() => updateOpinions(subreddit, stock, "SIX_MONTHS")} />
            <Button text="Y" onPress={() => updateOpinions(subreddit, stock, "YEAR")} />
        </View>
    );
}

export default SubredditOpinionResultsScreen;

const styles = StyleSheet.create({
    activity: {
        flex: 1,
        alignItems: "center",
        backgroundColor: properties.color.background,
    },
    button: {
        width: 250,
        height: 50,
        margin: 5,
    },
    buttonContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },
    title: {
        marginBottom: 50
    },
    chart: {
        height: '50%',
        width: '100%'
    }
});