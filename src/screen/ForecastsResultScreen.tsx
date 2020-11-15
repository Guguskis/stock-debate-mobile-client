import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import Button from "../common/Button";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";

interface Forecast {
    stock: {
        symbol: string,
        companyName: string,
        logoUrl: string,
        latestPrice: number
    },
    username: string,
    expirationPrice: number,
    targetPrice: number,
    successCoefficient: number
    expirationDate: Date,
    createdDate: Date,
    type: string,
}

const ForecastsItem = (props: { forecast: Forecast }) => {
    const forecast = props.forecast;

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
                source={{ uri: forecast.stock.logoUrl }}
            />
            <Text style={styles.text}>{getFormattedDate(forecast.createdDate)}</Text>
        </View>
    );
}

const parseForecasts = (forecasts: Array<any>): Array<Forecast> => {
    return forecasts.map(forecast => {
        const newForecast = forecast;
        newForecast.expirationDate = new Date(forecast.expirationDate);
        newForecast.createdDate = new Date(forecast.createdDate);
        return newForecast;
    });
}

const ForecastsResultScreen = () => {
    const route = useRoute();

    const [username, setUsername] = useState(route.params?.redditUser.username);
    const [forecasts, setForecasts] = useState<Array<Forecast>>(parseForecasts(route.params?.redditUser.forecasts));

    return (
        <View style={styles.activity}>
            <ForecastsItem forecast={forecasts[0]} />
        </View>
    );
}

export default ForecastsResultScreen;

const styles = StyleSheet.create({
    activity: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
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
    }
});