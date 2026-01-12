import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { secureFileService } from '@/services/storage/secure-file.service';
import { spacing } from '@/theme/spacing';

export default function CameraScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [micPermission, requestMicPermission] = useMicrophonePermissions();
    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<'back' | 'front'>('back');
    const [isCapturing, setIsCapturing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    if (!permission || !micPermission) {
        // Permissions are still loading
        return <View style={styles.container} />;
    }

    if (!permission.granted || !micPermission.granted) {
        // Permissions are not granted yet
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.message}>We need camera and microphone permissions</Text>
                <TouchableOpacity
                    onPress={async () => {
                        await requestPermission();
                        await requestMicPermission();
                    }}
                    style={styles.permissionButton}
                >
                    <Text style={styles.permissionText}>Grant Permissions</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (!cameraRef.current || isCapturing || isRecording) return;

        try {
            setIsCapturing(true);
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
            });

            if (photo?.uri) {
                await secureFileService.saveCapture(photo.uri);
                Alert.alert("Success", "Photo captured and stored securely in the app's vault.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to capture image.");
        } finally {
            setIsCapturing(false);
        }
    };

    const startRecording = async () => {
        if (!cameraRef.current || isCapturing || isRecording) return;

        try {
            setIsRecording(true);
            const video = await cameraRef.current.recordAsync();

            if (video?.uri) {
                await secureFileService.saveCapture(video.uri);
                Alert.alert("Success", "Video captured and stored securely in the app's vault.");
            }
        } catch (error) {
            console.error("Recording error:", error);
        } finally {
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (isRecording && cameraRef.current) {
            cameraRef.current.stopRecording();
        }
    };

    const openGallery = () => {
        router.push('/secure-gallery');
    };

    return (
        <View style={styles.container}>
            {/* Camera View - No Children! */}
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                mode="video"
            />

            {/* Overlay Controls */}
            {/* Top Controls */}
            <View style={styles.topControls}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="close" size={32} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
                <View style={styles.controlRow}>
                    {/* Gallery Button (Bottom Left) */}
                    <TouchableOpacity onPress={openGallery} style={styles.iconButton}>
                        <Ionicons name="images-outline" size={30} color="#FFF" />
                    </TouchableOpacity>

                    {/* Capture Button (Center) */}
                    <TouchableOpacity
                        style={[
                            styles.captureButton,
                            isCapturing && styles.capturing,
                            isRecording && styles.recording
                        ]}
                        onPress={takePicture}
                        onLongPress={startRecording}
                        onPressOut={stopRecording}
                        delayLongPress={200}
                        disabled={isCapturing}
                    >
                        <View style={[
                            styles.captureInner,
                            isRecording && styles.recordingInner
                        ]} />
                    </TouchableOpacity>

                    {/* Flip Camera (Bottom Right) */}
                    <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                        <Ionicons name="camera-reverse-outline" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: spacing.xl,
    },
    message: {
        textAlign: 'center',
        marginBottom: spacing.lg,
        color: '#FFF',
        fontSize: 16,
    },
    permissionButton: {
        backgroundColor: '#444',
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    permissionText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    closeButton: {
        padding: spacing.md,
    },
    closeText: {
        color: '#AAA',
    },
    camera: {
        flex: 1,
    },
    topControls: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 30, // Add padding to avoid edge hugging
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Changed to space-between for better 3-item layout
        alignItems: 'center',
    },
    iconButton: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 25,
        width: 50, // Fixed width for alignment
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    capturing: {
        backgroundColor: 'rgba(255,255,0,0.3)',
    },
    recording: {
        backgroundColor: 'rgba(255,0,0,0.3)',
        transform: [{ scale: 1.2 }],
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
    },
    recordingInner: {
        backgroundColor: '#F00',
        transform: [{ scale: 0.6 }],
        borderRadius: 10,
    },
});
