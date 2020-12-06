import React from "react";
import { Text, StyleProp, StyleSheet } from "react-native";
import properties from "../properties/properties";

interface Props {
    style?: StyleProp<any>;
    text?: "StockDebate"
}

const Title = (props: Props) => {
    return (
        <Text style={[props.style, styles.text]}>
            {props.text}
        </Text>
    );
}

export default Title;

const styles = StyleSheet.create({
    text: {
        fontSize: properties.font.size.veryLarge,
        color: properties.color.text
    }
})