import React from "react";
import { TouchableOpacity, Text, StyleProp, StyleSheet } from "react-native";
import properties from "../properties/properties";

interface Props {
    style?: StyleProp<any>,
    onPress?: () => void,
    text?: string
}

const Button = (props: Props,) => {
    return (
        <TouchableOpacity style={props.style} onPress={props.onPress}>
            <Text style={[styles.text, props.style]}>
                {props.text}
            </Text>
        </TouchableOpacity >
    );
}

export default Button;


const styles = StyleSheet.create({
    text: {
        width: "100%",
        textAlignVertical: "center",
        textAlign: "center",
        backgroundColor: properties.color.primary,
        fontSize: properties.font.size.large
    }
})