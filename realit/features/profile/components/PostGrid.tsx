import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PostResponse } from '@/services/profile/types';
import { spacing } from '@/theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';

interface PostGridProps {
    posts: PostResponse[];
    onPostPress?: (postIndex: number) => void;
    onEndReached?: () => void;
    isLoading?: boolean;
    ListHeaderComponent?: React.ReactElement | null;
}

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = width / COLUMN_COUNT;

/**
 * Grid media item that handles both images and videos.
 * For videos, generates a thumbnail or shows a styled fallback.
 */
const GridMediaItem = ({ media }: { media: { media_url: string; media_type: string } }) => {
    const isVideo = media.media_type === 'video';

    if (isVideo) {
        return <GridVideoThumbnail uri={media.media_url} />;
    }

    return (
        <Image
            source={{ uri: media.media_url }}
            style={styles.image}
            resizeMode="cover"
        />
    );
};

/**
 * Attempts to generate a thumbnail from the video URL.
 * Shows a styled fallback with a play icon if it fails.
 */
const GridVideoThumbnail = ({ uri }: { uri: string }) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        VideoThumbnails.getThumbnailAsync(uri, { time: 1000, quality: 0.5 })
            .then(({ uri: thumbUri }) => {
                if (!cancelled) {
                    setThumbnail(thumbUri);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setFailed(true);
                    setLoading(false);
                }
            });
        return () => { cancelled = true; };
    }, [uri]);

    return (
        <View style={styles.videoThumbnailContainer}>
            {loading ? (
                <View style={styles.videoFallback}>
                    <ActivityIndicator size="small" color="#666" />
                </View>
            ) : thumbnail && !failed ? (
                <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={styles.videoFallback}>
                    <Ionicons name="videocam" size={28} color="rgba(255,255,255,0.6)" />
                </View>
            )}
            <View style={styles.videoIcon}>
                <Ionicons name="play" size={16} color="#FFF" />
            </View>
        </View>
    );
};

export const PostGrid: React.FC<PostGridProps> = ({
    posts,
    onPostPress,
    onEndReached,
    ListHeaderComponent
}) => {

    const renderItem = ({ item, index }: { item: PostResponse; index: number }) => {
        const firstMedia = item.media && item.media.length > 0 ? item.media[0] : null;

        if (!firstMedia) return null;

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                activeOpacity={0.8}
                onPress={() => onPostPress?.(index)}
            >
                <GridMediaItem media={firstMedia} />
            </TouchableOpacity>
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
    videoThumbnailContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
    },
    videoFallback: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
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
