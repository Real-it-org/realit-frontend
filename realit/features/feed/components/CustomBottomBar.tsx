import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientButton } from '@/components/GradientButton';
import { spacing } from '@/theme/spacing';

export const CustomBottomBar = () => {
    return (
        <View style={styles.container}>
            {/* Background Gradient for the bar itself */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)', '#000']}
                style={styles.background}
            />

            <View style={styles.buttonContainer}>
                {/* 1. Post Button - Blue/Purple/Silver Gradient */}
                <View style={styles.buttonWrapper}>
                    <GradientButton
                        colors={['#4facfe', '#00f2fe']} // Cyan/Blue
                        icon={<MaterialCommunityIcons name="note-edit-outline" size={24} color="#FFF" />}
                        label="Post"
                        style={styles.button}
                    />
                </View>

                {/* 2. Real-it Button - Green/Yellow/Fire Gradient (Center, slightly larger) */}
                <View style={[styles.buttonWrapper, styles.centerWrapper]}>
                    <GradientButton
                        colors={['#43e97b', '#38f9d7']} // Green/Teal
                        icon={<Ionicons name="eye-outline" size={30} color="#FFF" />}
                        label="Real-it"
                        style={styles.button}
                        labelStyle={{ fontSize: 16 }}
                    />
                </View>

                {/* 3. Genie Button - Purple/Pink/Magic Gradient */}
                <View style={styles.buttonWrapper}>
                    <GradientButton
                        colors={['#667eea', '#764ba2']} // Purple
                        icon={<MaterialCommunityIcons name="lamp-outline" size={24} color="#FFF" />}
                        label="Genie"
                        style={styles.button}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100, // Taller to accommodate the buttons
        justifyContent: 'flex-end',
        paddingBottom: spacing.lg,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        top: 20, // Fade starts a bit lower
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.md,
    },
    buttonWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    centerWrapper: {
        // bottom: 15, // Removed lift to align with other buttons
    },
    button: {
        width: '90%',
        height: 60,
        borderRadius: 16,
    },
    centerButton: {
        // height: 70, // Removed custom height
        // borderRadius: 20, 
    }
});
