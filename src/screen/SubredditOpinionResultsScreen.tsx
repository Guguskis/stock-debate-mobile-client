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
                yMax={getMaxOpinionsPerStep(opinionsDetails) / 2}
                keys={keys}
                colors={colors}
                curve={shape.curveNatural}
                showGrid={false} />

            <View style={styles.dateRangeButtonContainer}>
                <Button style={styles.dateRangeButton} text="D" onPress={() => updateOpinions(subreddit, stock, "DAY")} />
                <Button style={styles.dateRangeButton} text="W" onPress={() => updateOpinions(subreddit, stock, "WEEK")} />
                <Button style={styles.dateRangeButton} text="1M" onPress={() => updateOpinions(subreddit, stock, "MONTH")} />
                <Button style={styles.dateRangeButton} text="3M" onPress={() => updateOpinions(subreddit, stock, "THREE_MONTHS")} />
                <Button style={styles.dateRangeButton} text="6M" onPress={() => updateOpinions(subreddit, stock, "SIX_MONTHS")} />
                <Button style={styles.dateRangeButton} text="Y" onPress={() => updateOpinions(subreddit, stock, "YEAR")} />
            </View>
        </View>
    );
}

export default SubredditOpinionResultsScreen;

const styles = StyleSheet.create({
    activity: {
        flex: 1,
        alignItems: "center",
        backgroundColor: properties.color.background,
        padding: 10
    },
    button: {
        width: 250,
        height: 50,
        margin: 5,
    },
    title: {
        marginBottom: 50
    },
    chart: {
        height: 300,
        width: '100%'
    },
    dateRangeButtonContainer: {
        borderWidth: 1,
        flexDirection: "row",
        width: '100%',
        backgroundColor: properties.color.primary,
        justifyContent: "space-evenly"
    },
    dateRangeButton: {
        width: 50,
        margin: 1
    }
});

const getMaxOpinionsPerStep = (opinions: any) => {
    const opinionsPerSteps = opinions
        .map(opinion => opinion.sellCount + opinion.buyCount + opinion.neutralCount)

    if (opinionsPerSteps.length == 0) return 0;

    return Math.max(...opinionsPerSteps);
}