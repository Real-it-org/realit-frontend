import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Dimensions, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';
import { postsService, MediaType } from '@/services/posts/posts.service';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = 100;

export default function PostCreationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [images] = useState<string[]>(params.images ? JSON.parse(params.images as string) : []);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (loading) return;

        try {
            setLoading(true);
            console.log("Starting post creation...");

            // 1. Prepare Media Metadata
            const mediaItems = await Promise.all(images.map(async (uri) => {
                const fileInfo = await FileSystem.getInfoAsync(uri);
                if (!fileInfo.exists) throw new Error(`File does not exist: ${uri}`);

                const filename = uri.split('/').pop() || 'image.jpg';
                const isVideo = filename.endsWith('.mov') || filename.endsWith('.mp4');

                return {
                    media_type: isVideo ? MediaType.VIDEO : MediaType.IMAGE,
                    size_bytes: fileInfo.size,
                    filename: filename
                };
            }));

            // 2. Create Post Intent
            const createResponse = await postsService.createPost({
                heading: subject,
                description: description,
                verification_status: 'verified',
                media: mediaItems
            });

            console.log("Post intent created:", createResponse.post_id);

            // 3. Upload Media
            const successfulUploads: string[] = [];

            await Promise.all(createResponse.media.map(async (mediaConfig, index) => {
                const localUri = images[index];
                // Determine mime type
                const filename = localUri.split('/').pop() || 'image.jpg';
                const isVideo = filename.endsWith('.mov') || filename.endsWith('.mp4');
                const mimeType = isVideo ? 'video/mp4' : 'image/jpeg';

                await postsService.uploadMedia(mediaConfig.upload_url, localUri, mimeType);
                successfulUploads.push(mediaConfig.asset_id);
            }));

            console.log("All uploads complete.");

            // 4. Confirm Post
            await postsService.confirmPost({
                post_id: createResponse.post_id,
                uploaded_asset_ids: successfulUploads
            });

            console.log("Post confirmed!");
            Alert.alert("Success", "Post created successfully!", [
                { text: "OK", onPress: () => router.replace('/feed') } // Cast to avoid typed routes issue
            ]);

        } catch (error: any) {
            console.error("Post creation failed:", error);
            if (error.response) {
                console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
                console.error("Error response status:", error.response.status);
                console.error("Error response headers:", error.response.headers);
            }
            Alert.alert("Error", error.message || "Failed to create post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Posting page</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Selected Images */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Selected Images</Text>
                        <FlatList
                            data={images}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.thumbnail} resizeMode="cover" />
                            )}
                            contentContainerStyle={styles.imageList}
                        />
                    </View>

                    {/* Subject Input */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Subject</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Label the event."
                            placeholderTextColor={colors.textSecondary}
                            value={subject}
                            onChangeText={setSubject}
                        />
                    </View>

                    {/* Description Input */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Say Something about the event"
                            placeholderTextColor={colors.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.postButton, { opacity: (subject && description && !loading) ? 1 : 0.7 }]}
                        onPress={handlePost}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.buttonTextDark} />
                        ) : (
                            <Text style={styles.postButtonText}>Post</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100, // Space for footer
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        paddingTop: spacing.xs,
    },
    backButton: {
        marginRight: spacing.md,
    },
    headerTitle: {
        color: '#42a5f5', // Specific blue from design
        fontSize: 18,
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    label: {
        color: colors.textPrimary,
        fontSize: 16,
        marginBottom: spacing.sm,
    },
    imageList: {
        paddingRight: spacing.md,
    },
    thumbnail: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE * 1.5, // Portrait aspect ratio look
        marginRight: spacing.xs,
        backgroundColor: colors.inputBg,
        borderRadius: 4,
    },
    input: {
        backgroundColor: colors.inputBg,
        borderRadius: 8,
        padding: spacing.md,
        color: colors.textPrimary,
        fontSize: 16,
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',
    },
    footer: {
        padding: spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 0 : spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    postButton: {
        backgroundColor: colors.buttonPrimary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    postButtonText: {
        color: colors.buttonTextDark,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
