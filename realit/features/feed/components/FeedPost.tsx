import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface FeedPostProps {
    heading: string;
    userAvatar: any; // Can be require() or object with uri
    postImage: any; // Can be require() or object with uri
    likes: number;
    shares: number;
    comments: number;
    description: string;
    onAvatarPress?: () => void;
    onLikePress?: () => void;
    onSharePress?: () => void;
    onCommentPress?: () => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
    heading,
    userAvatar,
    postImage,
    likes,
    shares,
    comments,
    description,
    onAvatarPress,
    onLikePress,
    onSharePress,
    onCommentPress,
}) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.heading}>{heading}</Text>
                <TouchableOpacity onPress={onAvatarPress}>
                    <Image source={userAvatar} style={styles.avatar} />
                </TouchableOpacity>
            </View>

            {/* Post Image */}
            <View style={styles.imageContainer}>
                <Image source={postImage} style={styles.postImage} resizeMode="cover" />
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionItem} onPress={onLikePress}>
                    <FontAwesome5 name="fire" size={24} color="#FF5722" />
                    <Text style={styles.actionText}>{likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={onSharePress}>
                    <FontAwesome5 name="users" size={20} color="#00C853" />
                    <Text style={styles.actionText}>{shares}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={onCommentPress}>
                    <FontAwesome5 name="comment" size={20} color="#FFF" />
                    <Text style={styles.actionText}>{comments}</Text>
                </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.footer}>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        marginBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        paddingBottom: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.5)', // Slight background for contrast if needed, but mainly black
    },
    heading: {
        color: colors.textPrimary,
        fontSize: 20, // Slightly large heading
        fontWeight: 'bold',
        fontFamily: 'serif', // Trying to match the elegant font in the image
    },
    avatar: {
        width: 30, // Small avatar
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    imageContainer: {
        width: '100%',
        height: 300, // Fixed height for consistency, or aspect ratio
        backgroundColor: '#1a1a1a',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        gap: spacing.lg, // Space between action groups
    },
    actionItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        color: colors.textPrimary,
        fontSize: 12,
        marginTop: 4,
    },
    footer: {
        paddingHorizontal: spacing.md,
        marginTop: spacing.sm,
    },
    description: {
        color: colors.textPrimary,
        fontSize: 14,
        fontStyle: 'italic', // Matches the vibe in the screenshot
    },
});
