import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { StackedAreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import Button from "../common/Button";
import properties from "../properties/properties";
import Title from "../common/Title";
import useOpinionsRetriever from "../helpers/useOpinionsRetriever";

const DATE_RANGES = [
    { label: "D ", value: "DAY" },
    { label: "2D", value: "TWO_DAYS" },
    { label: "5D", value: "FIVE_DAYS" },
    { label: "2W", value: "TWO_WEEKS" },
    { label: "1M", value: "MONTH" },
    { label: "D ", value: "THREE_MONTHS" },
    { label: "Y ", value: "YEAR" },
]

interface ButtonContainerProps {
    updateOpinions: (dateRange: string) => void;
}

const ButtonContainer = (props: ButtonContainerProps) => {

    const [activeButtonIndex, setActiveButtonIndex] = useState(0);

    const toDateRangeButton = (dateRange: { label: string; value: string; }, index: number) => {

        const handleOnPress = () => {
            setActiveButtonIndex(index);
            props.updateOpinions(dateRange.value)
        }

        return (
            <Button
                style={[
                    styles.dateRangeButton,
                    { backgroundColor: activeButtonIndex == index ? properties.color.primaryDark : null }]}
                text={dateRange.label}
                onPress={handleOnPress} />
        );
    };

    return (
        <View style={styles.dateRangeButtonContainer}>
            {DATE_RANGES.map(toDateRangeButton)}
        </View>
    )
}

const SubredditOpinionResultsScreen = () => {
    const route = useRoute();

    const { subreddit, stock: stockSymbol, dateRange, opinionsDetails, updateOpinions }
        = useOpinionsRetriever(
            route?.params.subreddit,
            route?.params.stock.symbol,
            "DAY"
        );

    const colors = ['#ff0000', '#00ff00', '#aaaaaa']
    const keys = ['sellCount', 'buyCount', 'neutralCount']

    return (
        <View style={styles.activity}>
            <Title style={styles.title} />


            <StackedAreaChart
                style={styles.chart}
                data={opinionsDetails}
                yMax={getMaxOpinionsPerStep(opinionsDetails) * 1.25}
                keys={keys}
                colors={colors}
                curve={shape.curveNatural}
                showGrid={false} />

            <ButtonContainer
                updateOpinions={updateOpinions} />
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
        justifyContent: "space-evenly",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    dateRangeButton: {
        width: 35,
        fontSize: properties.font.size.medium,
        margin: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    }
});

const getMaxOpinionsPerStep = (opinions: any) => {
    const opinionsPerSteps = opinions
        .map(opinion => opinion.sellCount + opinion.buyCount + opinion.neutralCount)

    if (opinionsPerSteps.length == 0) return 0;

    return Math.max(...opinionsPerSteps);
}