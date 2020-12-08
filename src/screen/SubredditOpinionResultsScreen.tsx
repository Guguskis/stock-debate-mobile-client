import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Grid, StackedAreaChart, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import Button from "../common/Button";
import properties from "../properties/properties";
import Title from "../common/Title";
import useOpinionsRetriever from "../helpers/useOpinionsRetriever";

const DATE_RANGES = [
    { label: "D ", value: "DAY" },
    { label: "3D", value: "THREE_DAYS" },
    { label: "W", value: "WEEK" },
    { label: "M", value: "MONTH" },
    { label: "3M ", value: "THREE_MONTHS" },
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
                key={index.toString()}
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
        = useOpinionsRetriever(route?.params.subreddit, route?.params.stock.symbol, DATE_RANGES[0].value);

    const colors = ['#ff0000', '#00ff00', '#aaaaaa']
    const keys = ['sellCount', 'buyCount', 'neutralCount']

    return (
        <View style={styles.activity}>
            <Title
                style={styles.title}
                text={"Opinions"} />

            <Text
                style={styles.description}>
                {`r/${subreddit} talks about ${stockSymbol}`}
            </Text>

            <View style={styles.chartContainer}>

                <StackedAreaChart
                    style={{ flex: 1 }}
                    data={opinionsDetails}
                    keys={keys}
                    colors={colors}
                    curve={shape.curveBasis}
                    animate={true}>
                    <Grid />
                </StackedAreaChart>
                <YAxis
                    style={styles.yAxis}
                    data={StackedAreaChart.extractDataPoints(opinionsDetails, keys)}
                    svg={{
                        fontSize: 12,
                        fill: properties.color.primary,
                        stroke: 'white',
                        strokeWidth: 0.1,
                    }} />
            </View>

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
        padding: 15
    },
    button: {
        width: 250,
        height: 50,
        margin: 5,
    },
    title: {
        marginBottom: 10
    },
    chartContainer: {
        height: 300,
        width: '100%',
        flexDirection: "row"
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
    },
    description: {
        fontSize: properties.font.size.large,
        color: properties.color.text,
        marginBottom: 50
    },
    yAxis: {
        position: 'absolute',
        top: 0,
        bottom: 0
    }
});

const getMaxOpinionsPerStep = (opinions: any) => {
    const opinionsPerSteps = opinions
        .map(opinion => opinion.sellCount + opinion.buyCount + opinion.neutralCount)

    if (opinionsPerSteps.length == 0) return 0;

    return Math.max(...opinionsPerSteps);
}