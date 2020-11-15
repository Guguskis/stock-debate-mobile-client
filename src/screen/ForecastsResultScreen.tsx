import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import Button from "../common/Button";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import images from "../assets/images";

interface Forecast {
    stock: {
        symbol: string,
        companyName: string,
        logoUrl: string,
        latestPrice: number
    },
    expirationPrice: number,
    targetPrice: number,
    successCoefficient: number
    expirationDate: Date,
    createdDate: Date,
    type: string,
}

const renderForecastItem = ({ item }: { item: Forecast }) => {


    const getFormattedDate = (date: Date) => {

        const yearBeforeNow = new Date();
        yearBeforeNow.setFullYear(yearBeforeNow.getFullYear() - 1);

        const appendPrefixZeroIfOneDigitNumber = (number: number) => {
            let result = "";
            if (number < 10) result += "0";
            result += number;
            return result;
        }

        const formattedMonth = appendPrefixZeroIfOneDigitNumber(date.getMonth() + 1);
        const formattedDay = appendPrefixZeroIfOneDigitNumber(date.getDay());

        if (date > yearBeforeNow) {
            return `${formattedMonth}/${formattedDay}`
        } else {
            let year = date.getFullYear().toString().substr(2, 2);
            return `${year}/${formattedMonth}/${formattedDay}`
        }
    }

    return (
        <View style={styles.forecastItem}>
            <Image
                style={styles.forecastLogo}
                source={{ uri: item.stock.logoUrl }} />
            <Text style={styles.text}>{getFormattedDate(item.createdDate)}</Text>
        </View>
    );
}

const StatisticsItem = (props: { imageUrl: any, percents: number }) => {

    const formattedPercents = Math.round(props.percents * 100) + '%';

    return (
        <View style={styles.statisticsItem}>
            <Image
                style={styles.statisticsItemLogo}
                source={props.imageUrl} />
            <Text style={styles.statisticsItemText}>{formattedPercents}</Text>
        </View>
    );
}

const parseForecasts = (forecasts: Array<any>): Array<Forecast> => {
    return forecasts.map(forecast => {
        const newForecast = JSON.parse(JSON.stringify(forecast)); // deep copy
        newForecast.expirationDate = new Date(forecast.expirationDate);
        newForecast.createdDate = new Date(forecast.createdDate);
        return newForecast;
    });
}

const ForecastsResultScreen = () => {
    const route = useRoute();

    const [username, setUsername] = useState(route.params?.redditUser.username);
    const [forecasts, setForecasts] = useState<Array<Forecast>>(parseForecasts(route.params?.redditUser.forecasts));

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <View style={styles.activity}>
            <Text style={styles.usernameText}>{username}'s' forecasts</Text>
            <View style={styles.statisticsContainer}>
                <StatisticsItem
                    imageUrl={images.successIcon}
                    percents={0.14} />

                <StatisticsItem
                    imageUrl={images.failureIcon}
                    percents={0.50} />

                <StatisticsItem
                    imageUrl={images.neutralIcon}
                    percents={0.36} />
            </View>

            <TextInput
                style={styles.inputField}
                onChangeText={setSearchQuery}
                value={searchQuery}
                placeholder="Search by company name" />

            <FlatList
                data={forecasts}
                renderItem={renderForecastItem}
                keyExtractor={(forecast, index) => index.toString()} />
        </View>
    );
}

export default ForecastsResultScreen;

const styles = StyleSheet.create({
    activity: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: properties.color.background,
        padding: 5
    },
    buttonContainer: {
        alignItems: "flex-end"
    },
    inputLabel: {
        fontSize: properties.font.size.medium,
        color: properties.color.text
    },
    forecastLogo: {
        width: 64,
        height: 64
    },
    forecastItem: {
        height: 100,
        width: '100%',
        borderRadius: 50,
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: properties.color.primary
    },
    text: {
        fontSize: 15,
        color: properties.color.text
    },
    usernameText: {
        fontSize: properties.font.size.large,
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
    statisticsContainer: {
        width: '100%',
        height: 75,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    statisticsItem: {
        flexDirection: "row",
        alignItems: "center"
    },
    statisticsItemLogo: {
        height: 60,
        width: 60,
        marginRight: 5
    },
    statisticsItemText: {
        fontSize: properties.font.size.large,
        color: properties.color.text
    }
});