import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


const MainScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.body}>
            <Text>hello</Text>
        </View>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    body: {
        width: 100,
        height: 100,
        backgroundColor: 'black'
    }
})