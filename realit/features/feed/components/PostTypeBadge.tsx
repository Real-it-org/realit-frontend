import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export type PostType = 'post' | 'realit' | 'ai';

interface PostTypeBadgeProps {
    type: PostType;
    size?: 'small' | 'medium';
}

interface BadgeConfig {
    label: string;
    color: string;
    icon: React.ReactNode;
}

const getBadgeConfig = (type: PostType, iconSize: number): BadgeConfig => {
    switch (type) {
        case 'post':
            return {
                label: 'Post',
                color: colors.buttonPost,
                icon: <MaterialCommunityIcons name="note-edit-outline" size={iconSize} color={colors.buttonPost} />,
            };
        case 'realit':
            return {
                label: 'Real-it',
                color: colors.buttonRealIt,
                icon: <Ionicons name="checkmark-circle-outline" size={iconSize} color={colors.buttonRealIt} />,
            };
        case 'ai':
            return {
                label: 'Genie',
                color: colors.buttonGenie,
                icon: <MaterialCommunityIcons name="auto-fix" size={iconSize} color={colors.buttonGenie} />,
            };
    }
};

export const PostTypeBadge: React.FC<PostTypeBadgeProps> = ({ type, size = 'small' }) => {
    const iconSize = size === 'small' ? 14 : 18;
    const config = getBadgeConfig(type, iconSize);

    return (
        <View style={[styles.badge, { borderColor: config.color, backgroundColor: config.color + '18' }]}>
            {config.icon}
            <Text style={[styles.label, { color: config.color, fontSize: size === 'small' ? 11 : 13 }]}>
                {config.label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
    },
    label: {
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});
