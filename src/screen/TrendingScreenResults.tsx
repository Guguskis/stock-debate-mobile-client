import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import Title from "../common/Title";
import Logo from "../common/Logo";

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

const renderTrendItem = ({ item }: { item: Trend }) => {

    return (
        <View style={styles.trendItem}>
            <Logo source={item.stock.logoUrl} />
            <Text style={styles.trendDetailsStockSymbol}>{item.stock.symbol}</Text>
            <View style={styles.trendDetailsContainer}>
                <Text style={styles.trendDetailsOpinionsTitle}>Opinions</Text>
                <View >
                    <Text>Total       {item.opinionsTotal} </Text>
                    <Text>Last day {item.opinionsLastDay}</Text>
                </View>
            </View>
        </View>
    );
}

const filterTrendsByQuery = (query: string, trends: Array<Trend>) => {
    return trends.filter(trend => {
        let lowercaseQuery = query.toLowerCase();
        let lowercaseSymbol = trend.stock.symbol.toLowerCase();
        let lowercaseCompany = trend.stock.companyName.toLowerCase();

        let symbolContainsQuery = lowercaseSymbol.includes(lowercaseQuery);
        let companyContainsQuery = lowercaseCompany.includes(lowercaseQuery);

        return symbolContainsQuery || companyContainsQuery;
    });
}

const TrendingScreenResults = () => {
    const route = useRoute();

    const [subreddit, setSubreddit] = useState(route.params?.subreddit);
    const [trends, setTrends] = useState<Array<Trend>>(route.params?.trends);
    const [filteredTrends, setFilteredTrends] = useState<Array<Trend>>(route.params?.trends);

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
                    { label: 'Total ▲', value: 'opinionsTotalAsc', },
                    { label: 'Total ▼', value: 'opinionsTotalDesc', },
                    { label: 'Last day ▲', value: 'opinionsLastDayAsc' },
                    { label: 'Last day ▼ ', value: 'opinionsLastDayDesc' },
                ]}
                placeholder="Sort"
                defaultValue={selectedSort}
                onChangeItem={item => setSelectedSort(item.value)}
            />
        )
    }

    useEffect(() => {
        let filteredForecasts = filterTrendsByQuery(searchQuery, trends);

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
            <Title text="Trending" />
            <Text style={styles.subredditText}>r/{subreddit}</Text>

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
        width: 275,
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
    trendDetailsStockSymbol: {
        fontSize: properties.font.size.large,
        width: 70,
        marginRight: 40
    },
    trendDetailsContainer: {

    },
    trendDetailsOpinionsTitle: {
        color: properties.color.text,
        borderBottomWidth: 1
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