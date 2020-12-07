import React from "react";
import { Text, StyleProp, StyleSheet } from "react-native";
import properties from "../properties/properties";

interface Props {
    style?: StyleProp<any>;
    text: string
}

const Title = (props: Props) => {
    return (
        <Text style={[styles.text, props.style]}>
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