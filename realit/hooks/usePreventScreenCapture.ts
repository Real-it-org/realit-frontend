import { useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

/**
 * A hook that prevents screen capture (screenshots and screen recording)
 * while the screen is focused.
 */
export const usePreventScreenCapture = () => {
    useFocusEffect(
        useCallback(() => {
            const preventCapture = async () => {
                try {
                    await ScreenCapture.preventScreenCaptureAsync();
                } catch (e) {
                    console.warn('Failed to prevent screen capture:', e);
                }
            };

            const subscription = ScreenCapture.addScreenshotListener(() => {
                alert('Screenshots are not allowed within this app for privacy reasons.');
            });

            preventCapture();

            // Clean up when the screen loses focus or unmounts
            return () => {
                subscription.remove();
                const allowCapture = async () => {
                    try {
                        await ScreenCapture.allowScreenCaptureAsync();
                    } catch (e) {
                        console.warn('Failed to allow screen capture:', e);
                    }
                };
                allowCapture();
            };
        }, [])
    );
};
