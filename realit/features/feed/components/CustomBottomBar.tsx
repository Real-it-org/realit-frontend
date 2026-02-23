import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';

interface TabItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    onPress?: () => void;
}

export const CustomBottomBar = () => {
    const router = useRouter();

    const tabs: TabItem[] = [
        {
            key: 'post',
            label: 'Post',
            icon: <MaterialCommunityIcons name="note-edit-outline" size={24} color={colors.buttonPost} />,
            color: colors.buttonPost,
        },
        {
            key: 'realit',
            label: 'Real-it',
            icon: <Ionicons name="checkmark-circle-outline" size={26} color={colors.buttonRealIt} />,
            color: colors.buttonRealIt,
            onPress: () => router.push('/camera'),
        },
        {
            key: 'genie',
            label: 'Genie',
            icon: <MaterialCommunityIcons name="auto-fix" size={24} color={colors.buttonGenie} />,
            color: colors.buttonGenie,
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tab}
                        onPress={tab.onPress}
                        activeOpacity={0.7}
                    >
                        {/* Coloured dot indicator above the active-style icon */}
                        <View style={[styles.iconDot, { backgroundColor: tab.color + '22' }]}>
                            {tab.icon}
                        </View>
                        <Text style={[styles.label, { color: tab.color }]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
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
        backgroundColor: '#000',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#222',
        paddingBottom: Platform.OS === 'ios' ? 16 : 6,
        paddingTop: 5,
    },
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    iconDot: {
        width: 44,
        height: 34,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});
