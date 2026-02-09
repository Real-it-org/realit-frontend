import React from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { PostResponse } from '@/services/profile/types';
import { spacing } from '@/theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface PostGridProps {
    posts: PostResponse[];
    onEndReached?: () => void;
    isLoading?: boolean;
    ListHeaderComponent?: React.ReactElement | null;
}

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = width / COLUMN_COUNT;

export const PostGrid: React.FC<PostGridProps> = ({
    posts,
    onEndReached,
    ListHeaderComponent
}) => {

    const renderItem = ({ item }: { item: PostResponse }) => {
        const firstMedia = item.media && item.media.length > 0 ? item.media[0] : null;

        if (!firstMedia) return null;

        return (
            <View style={styles.itemContainer}>
                <Image
                    source={{ uri: firstMedia.media_url }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {firstMedia.media_type === 'VIDEO' && (
                    <View style={styles.videoIcon}>
                        <Ionicons name="play" size={16} color="#FFF" />
                    </View>
                )}
            </View>
        );
    };

    const renderEmpty = () => {
        // Only show empty state if there is a header (profile loaded) but no posts
        if (!posts || posts.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="camera-outline" size={48} color="#444" />
                    </View>
                    <Text style={styles.emptyText}>No posts yet</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={COLUMN_COUNT}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: spacing.xl,
        backgroundColor: '#000',
        minHeight: '100%',
    },
    itemContainer: {
        width: ITEM_SIZE,
        height: ITEM_SIZE, // Square
        borderWidth: 0.5,
        borderColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a', // placeholder color
    },
    videoIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 4,
    },
    emptyContainer: {
        paddingTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
});
