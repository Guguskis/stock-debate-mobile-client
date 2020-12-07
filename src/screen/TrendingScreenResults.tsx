import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Image, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import images from "../assets/images";
import DropDownPicker from "react-native-dropdown-picker";
import Title from "../common/Title";

interface Trend {
    stock: {
        symbol: string,
        companyName: string,
        logoUrl: string,
        latestPrice: number
    },
    opinionsTotal: number,
    opinionsLastDay: number,
}

const convertToPercentsString = (value: number) => Math.round(value * 100) + '%';

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
    const formattedDay = appendPrefixZeroIfOneDigitNumber(date.getDate());

    if (date > yearBeforeNow) {
        return `${formattedMonth}/${formattedDay}`
    } else {
        let year = date.getFullYear().toString().substr(2, 2);
        return `${year}/${formattedMonth}/${formattedDay}`
    }
}

const renderTrendItem = ({ item }: { item: Trend }) => {

    return (
        <View style={styles.trendItem}>
            <View style={styles.trendLogoContainer}>
                <Image
                    style={styles.trendLogo}
                    source={{ uri: item.stock.logoUrl }} />
            </View>
            <Text>{item.stock.symbol}</Text>
            <View style={styles.trendDetailsContainer}>
                <Text style={styles.trendDetailsStock}>Opinions</Text>
                <View style={styles.trendDetailsOpinions}>
                    <Text>Total {item.opinionsTotal} </Text>
                    <Text>Last day {item.opinionsLastDay}</Text>
                </View>
            </View>

        </View>
    );
}

const parseForecasts = (forecasts: Array<any>): Array<Trend> => {
    return forecasts.map(forecast => {
        const newForecast = JSON.parse(JSON.stringify(forecast)); // deep copy
        newForecast.expirationDate = new Date(forecast.expirationDate);
        newForecast.createdDate = new Date(forecast.createdDate);
        return newForecast;
    });
}

const filterForecastsByQuery = (query: string, forecasts: Array<Trend>) => {
    return forecasts.filter(forecast => {
        let lowercaseQuery = query.toLowerCase();
        let lowercaseSymbol = forecast.stock.symbol.toLowerCase();
        let lowercaseCompany = forecast.stock.companyName.toLowerCase();

        let symbolContainsQuery = lowercaseSymbol.includes(lowercaseQuery);
        let companyContainsQuery = lowercaseCompany.includes(lowercaseQuery);

        return symbolContainsQuery || companyContainsQuery;
    });
}



const TrendingScreenResults = () => {
    const route = useRoute();

    const [subreddit, setSubreddit] = useState(route.params?.subreddit);
    const [trends, setTrends] = useState<Array<Trend>>(parseForecasts(route.params?.trends));
    const [filteredTrends, setFilteredTrends] = useState<Array<Trend>>(parseForecasts(route.params?.trends));

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSort, setSelectedSort] = useState("");

    const SortPicker = () => {
        return (
            <DropDownPicker
                style={styles.sortTypeSelector}
                itemStyle={styles.sortTypeSelectorItem}
                dropDownStyle={styles.sortTypeSelectorDropdown}
                items={[
                    { label: 'Sort', value: '', },
                    { label: 'Total asc', value: 'opinionsTotalAsc', },
                    { label: 'Total desc', value: 'opinionsTotalDesc', },
                    { label: 'Last day asc', value: 'opinionsLastDayAsc' },
                    { label: 'Last day desc ', value: 'opinionsLastDayDesc' },
                ]}
                placeholder="Sort"
                defaultValue={selectedSort}
                onChangeItem={item => setSelectedSort(item.value)}
            />
        )
    }

    useEffect(() => {
        let filteredForecasts = filterForecastsByQuery(searchQuery, trends);

        if (selectedSort != "") {
            filteredForecasts = filteredForecasts.sort((trendA, trendB) => {
                if (selectedSort == "opinionsTotalAsc") {
                    return trendA.opinionsTotal > trendB.opinionsTotal;
                } else if (selectedSort == "opinionsTotalDesc") {
                    return trendA.opinionsTotal < trendB.opinionsTotal;
                } else if (selectedSort == "opinionsLastDayAsc") {
                    return trendA.opinionsLastDay > trendB.opinionsLastDay;
                } else if (selectedSort == "opinionsLastDayDesc") {
                    return trendA.opinionsLastDay < trendB.opinionsLastDay;
                } else {
                    console.log(`Unable to sort by '${selectedSort}'`);
                    return true;
                }
            })
        }

        setFilteredTrends(filteredForecasts);

    }, [searchQuery, selectedSort])

    return (
        <View style={styles.activity}>
            {/* <Title text={`r/${subreddit == "" ? "all" : subreddit}`} /> */}
            <Text style={styles.subredditText}>r/{subreddit == "" ? "all" : subreddit}</Text>

            <View style={styles.filterContainer}>
                <TextInput
                    style={styles.inputField}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    placeholder="Search company name" />
                <SortPicker />
            </View>

            <FlatList
                data={filteredTrends}
                renderItem={renderTrendItem}
                keyExtractor={(trend, index) => index.toString()} />

        </View>
    );
}

export default TrendingScreenResults;

const styles = StyleSheet.create({
    activity: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: properties.color.background,
        padding: 5
    },
    text: {
        fontSize: 15,
        color: properties.color.text
    },
    subredditText: {
        fontSize: properties.font.size.large,
        color: properties.color.text
    },
    inputField: {
        height: 50,
        width: 200,
        borderColor: "black",
        borderWidth: 1,
        fontSize: properties.font.size.small,
        backgroundColor: properties.color.primary,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    filterContainer: {
        width: '100%',
        height: 50,
        flexDirection: "row",
        marginBottom: 10,
    },
    sortTypeSelector: {
        width: 125,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: properties.color.primary
    },
    sortTypeSelectorItem: {
        justifyContent: 'flex-start',
        backgroundColor: properties.color.primary
    },
    sortTypeSelectorDropdown: {
        backgroundColor: properties.color.primary,
        borderColor: 'black'
    },
    trendDetailsStock: {

    },
    trendDetailsContainer: {

    },
    trendDetailsOpinions: {

    },
    trendLogoContainer: {
        marginRight: 20,
        padding: 10,
        borderRadius: 30,
        backgroundColor: properties.color.logoBackground
    },
    trendLogo: {
        width: 54,
        height: 54
    },
    trendItem: {
        height: 75,
        width: '100%',
        borderRadius: 50,
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: properties.color.primary
    },
});