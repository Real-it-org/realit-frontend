import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../theme/colors';

interface BackButtonProps {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    color?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
    onPress,
    style,
    color = colors.textPrimary
}) => {
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            if (router.canGoBack()) {
                router.back();
            } else {
                // Fallback or no-op if can't go back, but typically we might want to go to a default route
                // For now, simple router.back() is fine or no-op
                console.warn('Cannot go back');
            }
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[styles.container, style]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="arrow-back" size={24} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        // Default styles if any needed, but usually it's just the icon
        // Maybe some padding for touch area
        padding: 4,
    },
});
