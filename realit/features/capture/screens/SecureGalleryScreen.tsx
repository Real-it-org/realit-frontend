import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, Modal, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video'; // New Import
import * as VideoThumbnails from 'expo-video-thumbnails';
import { secureFileService } from '@/services/storage/secure-file.service';
import { spacing } from '@/theme/spacing';

const { width, height } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = width / COLUMN_COUNT;

/**
 * Individual Gallery Grid Item
 */
const GalleryItem = ({
    uri,
    index,
    onPress,
    onLongPress,
    isSelectionMode,
    isSelected
}: {
    uri: string,
    index: number,
    onPress: (index: number) => void,
    onLongPress: (index: number) => void,
    isSelectionMode: boolean,
    isSelected: boolean
}) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const isVideo = uri.endsWith('.mov') || uri.endsWith('.mp4');

    useEffect(() => {
        if (isVideo) {
            generateThumbnail();
        }
    }, [uri]);

    const generateThumbnail = async () => {
        try {
            const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, {
                time: 1000,
                quality: 0.5,
            });
            setThumbnail(thumbUri);
        } catch (e) {
            console.warn("Could not generate thumbnail", e);
        }
    };

    return (
        <TouchableOpacity
            onPress={() => onPress(index)}
            onLongPress={() => onLongPress(index)}
            delayLongPress={300}
            activeOpacity={0.7}
            style={styles.itemContainer}
        >
            <Image
                source={{ uri: isVideo && thumbnail ? thumbnail : uri }}
                style={[styles.image, isSelected && styles.selectedImage]}
                resizeMode="cover"
            />
            {isSelected && (
                <View style={styles.selectionOverlay}>
                    <Ionicons name="checkmark-circle" size={24} color="#43e97b" />
                </View>
            )}
            {isSelectionMode && !isSelected && (
                <View style={styles.selectionIndicator} />
            )}

            {isVideo && (
                <View style={styles.videoIcon}>
                    <Ionicons name="play" size={20} color="#FFF" />
                </View>
            )}
        </TouchableOpacity>
    );
};

/**
 * Helper to manage video player logic
 */
const FullScreenVideo = ({ uri, isFocused }: { uri: string, isFocused: boolean }) => {
    const player = useVideoPlayer(uri, player => {
        player.loop = true;
    });

    useEffect(() => {
        if (isFocused) {
            player.play();
        } else {
            player.pause();
        }
    }, [isFocused, player]);

    return (
        <View style={styles.fullScreenItemContainer}>
            <VideoView
                style={styles.fullScreenMedia}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
            />
        </View>
    );
};

/**
 * Full Screen Slide Item
 */
const FullScreenItem = ({ uri, isFocused }: { uri: string, isFocused: boolean }) => {
    const isVideo = uri.endsWith('.mov') || uri.endsWith('.mp4');

    if (isVideo) {
        return <FullScreenVideo uri={uri} isFocused={isFocused} />;
    }

    return (
        <View style={styles.fullScreenItemContainer}>
            <Image
                source={{ uri }}
                style={styles.fullScreenMedia}
                resizeMode="contain"
            />
        </View>
    );
};

export default function SecureGalleryScreen() {
    const router = useRouter();
    const [captures, setCaptures] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Viewer State
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    // Selection State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadCaptures();
    }, []);

    const loadCaptures = async () => {
        try {
            setLoading(true);
            const files = await secureFileService.getCaptures();
            const sorted = files.sort().reverse();
            setCaptures(sorted);
        } catch (error) {
            console.error("Failed to load captures", error);
            Alert.alert("Error", "Could not load secure gallery.");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (uri: string) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(uri)) {
            newSelection.delete(uri);
        } else {
            newSelection.add(uri);
        }
        setSelectedItems(newSelection);
    };

    const handleItemPress = (index: number) => {
        const uri = captures[index];
        if (isSelectionMode) {
            toggleSelection(uri);
        } else {
            openViewer(index);
        }
    };

    const handleItemLongPress = (index: number) => {
        const uri = captures[index];
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleSelection(uri);
        }
    };

    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedItems(new Set());
    };

    const handleDelete = () => {
        if (selectedItems.size === 0) return;

        Alert.alert(
            "Delete Items",
            `Are you sure you want to delete ${selectedItems.size} item(s)? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const params = Array.from(selectedItems); // Copy for loop
                            await Promise.all(params.map(uri => secureFileService.deleteCapture(uri)));

                            // Refresh list and keep selection mode off
                            await loadCaptures();
                            cancelSelection();
                        } catch (e) {
                            Alert.alert("Error", "Failed to delete some items.");
                        }
                    }
                }
            ]
        );
    };

    const handlePost = () => {
        const itemsToPost = Array.from(selectedItems);
        if (itemsToPost.length === 0) {
            Alert.alert("Select Items", "Please select items to post.");
            return;
        }

        console.log("Posting items:", itemsToPost);
        Alert.alert("Post", `Ready to post ${itemsToPost.length} item(s). \n(Backend integration pending)`);
    };

    const openViewer = (index: number) => {
        setInitialIndex(index);
        setActiveIndex(index);
        setIsViewerOpen(true);
    };

    const closeViewer = () => {
        setIsViewerOpen(false);
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {isSelectionMode ? (
                    <>
                        <TouchableOpacity onPress={cancelSelection} style={styles.textButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{selectedItems.size} Selected</Text>
                        <View style={styles.actionRow}>
                            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                                <Ionicons name="trash-outline" size={26} color="#FF453A" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePost} style={[styles.iconButton, { marginLeft: 15 }]}>
                                <Ionicons name="send" size={26} color="#43e97b" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="close" size={28} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Secure Gallery</Text>
                        <TouchableOpacity onPress={() => setIsSelectionMode(true)} style={styles.textButton}>
                            <Text style={styles.selectText}>Select</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Grid Content */}
            {captures.length === 0 && !loading ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="images-outline" size={64} color="#444" />
                    <Text style={styles.emptyText}>No secure captures yet</Text>
                </View>
            ) : (
                <FlatList
                    data={captures}
                    renderItem={({ item, index }) => (
                        <GalleryItem
                            uri={item}
                            index={index}
                            onPress={handleItemPress}
                            onLongPress={handleItemLongPress}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedItems.has(item)}
                        />
                    )}
                    keyExtractor={(item) => item}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.listContent}
                    extraData={selectedItems}
                />
            )}

            {/* Full Screen Viewer Modal */}
            <Modal
                visible={isViewerOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={closeViewer}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={closeViewer} style={styles.modalCloseButton}>
                        <Ionicons name="close-circle" size={40} color="#FFF" />
                    </TouchableOpacity>

                    <FlatList
                        data={captures}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={initialIndex}
                        getItemLayout={(data, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => (
                            <FullScreenItem uri={item} isFocused={index === activeIndex} />
                        )}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        backgroundColor: '#000',
        zIndex: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: spacing.xs,
    },
    textButton: {
        padding: spacing.xs,
    },
    selectText: {
        color: '#43e97b',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelText: {
        color: '#FFF',
        fontSize: 16,
    },
    actionRow: {
        flexDirection: 'row',
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    itemContainer: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderWidth: 1,
        borderColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#222',
        opacity: 1,
    },
    selectedImage: {
        opacity: 0.6,
    },
    videoIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 4,
    },
    selectionOverlay: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
    },
    selectionIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFF',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        marginTop: spacing.md,
        fontSize: 16,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 20,
    },
    fullScreenItemContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenMedia: {
        width: width,
        height: height * 0.8,
        // backgroundColor: 'red' // Debug only
    }
});
