import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import properties from '../properties/properties';

interface LogoProps {
    source: string
}

const Logo = (props: LogoProps) => {
    return (
        <View style={styles.logoContainer}>
            <Image
                style={styles.logo}
                source={{ uri: props.source }}
                resizeMode="contain" />
        </View>
    )
}

export default Logo;

const styles = StyleSheet.create({
    logoContainer: {
        width: 64,
        height: 64,
        marginRight: 20,
        margin: 5,
        padding: 5,
        borderRadius: 5,
        backgroundColor: properties.color.logoBackground
    },
    logo: {
        flex: 1
    },
})