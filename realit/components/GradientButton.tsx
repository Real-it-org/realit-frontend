import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface GradientButtonProps {
    onPress?: () => void;
    icon?: any; // Icon component
    label?: string;
    colors: readonly [string, string, ...string[]];
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    size?: number;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    onPress,
    icon,
    label,
    colors,
    style,
    labelStyle,
    size = 50,
}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.gradient, { width: '100%', height: '100%', borderRadius: 12 }]}
            >
                {/* Inner Glow Effect Overlay */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.innerOverlay}
                />

                {icon && <View>{icon}</View>}
                {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            </LinearGradient>

            {/* Bottom Shine/Reflection for 3D effect */}
            <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.2)']}
                style={styles.bottomShine}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
    },
    gradient: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2, // Border width simulation
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    innerOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 12,
    },
    bottomShine: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    label: {
        color: '#FFF',
        fontWeight: 'bold',
        marginTop: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
