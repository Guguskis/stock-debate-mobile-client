import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Image, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import properties from "../properties/properties";
import { TextInput } from "react-native-gesture-handler";
import images from "../assets/images";
import DropDownPicker from "react-native-dropdown-picker";

interface Forecast {
    stock: {
        symbol: string,
        companyName: string,
        logoUrl: string,
        latestPrice: number
    },
    expirationPrice: number,
    strikePrice: number,
    successCoefficient: number
    expirationDate: Date,
    createdDate: Date,
    forecastType: string,
}

const hasExpired = (forecast: Forecast) => {
    let now = new Date();

    return forecast.expirationDate < now;
};

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

const renderForecastItem = ({ item }: { item: Forecast }) => {

    const successCoefficientString = convertToPercentsString(item.successCoefficient);
    const successCoefficientStyle = {
        color: item.successCoefficient >= 0 ? '#3f3' : '#c33',
        fontWeight: "bold"
    }

    return (
        <View style={styles.forecastItem}>
            <View style={styles.forecastLogoContainer}>
                <Image
                    style={styles.forecastLogo}
                    source={{ uri: item.stock.logoUrl }} />
            </View>


            <View style={styles.forecastItemDetails}>
                <Text style={styles.text}>{item.forecastType} for {item.stock.symbol}</Text>
                <Text style={styles.text}>Created {getFormattedDate(item.createdDate)}</Text>

                {hasExpired(item) ?
                    <Text style={styles.text}>Expired</Text>
                    :
                    <Text style={styles.text}>Expires  {getFormattedDate(item.expirationDate)}</Text>
                }
            </View>
            <View style={styles.forecastItemDetails}>
                {!hasExpired(item) ? <Text style={styles.text}>Strike price  {item.strikePrice.toFixed(2)}</Text> : null}
                {!hasExpired(item) ? <Text style={styles.text}>Latest price {item.stock.latestPrice.toFixed(2)}</Text> : null}
                <Text style={[styles.text, successCoefficientStyle]}>Profit {successCoefficientString}</Text>

            </View>
        </View>
    );
}

const StatisticsItem = (props: { imageUrl: any, ratio: number }) => {
    return (
        <View style={styles.statisticsItem}>
            <Image
                style={styles.statisticsItemLogo}
                source={props.imageUrl} />
            <Text style={styles.statisticsItemText}>{convertToPercentsString(props.ratio)}</Text>
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

const getSuccessfulRatio = (forecasts: Array<Forecast>) => {
    let successful = forecasts
        .filter(forecast => hasExpired(forecast))
        .filter(forecast => forecast.successCoefficient >= 0)
        .length;
    if (forecasts.length == 0) return 0;
    return successful / forecasts.length;
}

const getUnsuccessfulRatio = (forecasts: Array<Forecast>) => {
    let unsuccessful = forecasts
        .filter(forecast => hasExpired(forecast))
        .filter(forecast => forecast.successCoefficient < 0)
        .length;
    if (forecasts.length == 0) return 0;
    return unsuccessful / forecasts.length;
}

const getOngoingRatio = (forecasts: Array<Forecast>) => {
    let ongoing = forecasts
        .filter(forecast => !hasExpired(forecast))
        .length;
    if (forecasts.length == 0) return 0;
    return ongoing / forecasts.length;
}

const filterForecastsByQuery = (query: string, forecasts: Array<Forecast>) => {
    return forecasts.filter(forecast => {
        let lowercaseQuery = query.toLowerCase();
        let lowercaseSymbol = forecast.stock.symbol.toLowerCase();
        let lowercaseCompany = forecast.stock.companyName.toLowerCase();

        let symbolContainsQuery = lowercaseSymbol.includes(lowercaseQuery);
        let companyContainsQuery = lowercaseCompany.includes(lowercaseQuery);

        return symbolContainsQuery || companyContainsQuery;
    });
}



const ForecastsResultScreen = () => {
    const route = useRoute();

    const [username, setUsername] = useState(route.params?.redditUser.username);
    const [forecasts, setForecasts] = useState<Array<Forecast>>(parseForecasts(route.params?.redditUser.forecasts));
    const [filteredForecasts, setFilteredForecasts] = useState<Array<Forecast>>(parseForecasts(route.params?.redditUser.forecasts));

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedSort, setSelectedSort] = useState("");
    const [successfulRatio, setSuccessfulRatio] = useState(0);
    const [unsuccessfulRatio, setUnsuccessfulRatio] = useState(0);
    const [ongoingRatio, setOngoingRatio] = useState(0);

    useEffect(() => {
        Keyboard.dismiss();
    }, [])

    useEffect(() => {
        if (filteredForecasts) {
            setSuccessfulRatio(getSuccessfulRatio(filteredForecasts));
            setUnsuccessfulRatio(getUnsuccessfulRatio(filteredForecasts));
            setOngoingRatio(getOngoingRatio(filteredForecasts));
        }
    }, [filteredForecasts]);

    const FilterPicker = () => {
        return (
            <DropDownPicker
                style={styles.forecastTypeSelector}
                itemStyle={styles.forecastTypeSelectorItem}
                dropDownStyle={styles.forecastTypeSelectorDropdown}
                items={[
                    { label: 'Type', value: '', },
                    { label: 'Call', value: 'CALL', },
                    { label: 'Put', value: 'PUT' },
                ]}
                placeholder="Type"
                defaultValue={selectedType}
                onChangeItem={item => setSelectedType(item.value)}
            />
        )
    }

    const SortPicker = () => {
        return (
            <DropDownPicker
                style={styles.sortTypeSelector}
                itemStyle={styles.sortTypeSelectorItem}
                dropDownStyle={styles.sortTypeSelectorDropdown}
                items={[
                    { label: 'Sort', value: '', },
                    { label: 'Expiration asc', value: 'expirationDateAsc', },
                    { label: 'Expiration desc', value: 'expirationDateDesc', },
                    { label: 'Profit asc', value: 'successCoefficientAsc' },
                    { label: 'Profit desc', value: 'successCoefficientDesc' },
                ]}
                placeholder="Sort"
                defaultValue={selectedSort}
                onChangeItem={item => setSelectedSort(item.value)}
            />
        )
    }

    useEffect(() => {
        let filteredForecasts = filterForecastsByQuery(searchQuery, forecasts);

        if (selectedType != "") {
            filteredForecasts = filteredForecasts.filter(forecast => forecast.forecastType === selectedType);
        }

        if (selectedSort != "") {
            filteredForecasts = filteredForecasts.sort((forecastA, forecastB) => {
                if (selectedSort == "expirationDateAsc") {
                    return forecastA.expirationDate > forecastB.expirationDate;
                } else if (selectedSort == "expirationDateDesc") {
                    return forecastA.expirationDate < forecastB.expirationDate;
                } else if (selectedSort == "successCoefficientAsc") {
                    return forecastA.successCoefficient > forecastB.successCoefficient;
                } else if (selectedSort == "successCoefficientDesc") {
                    return forecastA.successCoefficient < forecastB.successCoefficient;
                } else {
                    console.log(`Unable to sort by '${selectedSort}'`);
                    return true;
                }
            })
        }

        setFilteredForecasts(filteredForecasts);

    }, [searchQuery, selectedType, selectedSort])

    return (
        <View style={styles.activity}>
            <Text style={styles.usernameText}>{username}'s forecasts</Text>
            <View style={styles.statisticsContainer}>
                <StatisticsItem
                    imageUrl={images.successIcon}
                    ratio={successfulRatio} />

                <StatisticsItem
                    imageUrl={images.failureIcon}
                    ratio={unsuccessfulRatio} />

                <StatisticsItem
                    imageUrl={images.neutralIcon}
                    ratio={ongoingRatio} />
            </View>

            <View style={styles.filterContainer}>
                <TextInput
                    style={styles.inputField}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    placeholder="Search company name" />
                <FilterPicker />
                <SortPicker />
            </View>

            <FlatList
                data={filteredForecasts}
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
    forecastLogoContainer: {
        marginRight: 20,
        padding: 10,
        borderRadius: 30,
        backgroundColor: properties.color.logoBackground
    },
    forecastLogo: {
        width: 54,
        height: 54
    },
    forecastItem: {
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
        width: 200,
        borderColor: "black",
        borderWidth: 1,
        fontSize: properties.font.size.small,
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
        alignItems: "center",
        width: 130
    },
    statisticsItemLogo: {
        height: 60,
        width: 60,
        marginRight: 5
    },
    statisticsItemText: {
        fontSize: properties.font.size.large,
        color: properties.color.text
    },
    forecastItemDetails: {
        marginRight: 20
    },
    filterContainer: {
        width: '100%',
        height: 50,
        flexDirection: "row",
        marginBottom: 10,
    },
    forecastTypeSelector: {
        width: 75,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: properties.color.primary
    },
    forecastTypeSelectorItem: {
        justifyContent: 'flex-start',
        backgroundColor: properties.color.primary
    },
    forecastTypeSelectorDropdown: {
        backgroundColor: properties.color.primary,
        borderColor: 'black'
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
    }
});