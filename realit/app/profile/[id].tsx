import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';

export default function UserProfile() {
    const { id } = useLocalSearchParams();
    return <ProfileScreen userId={id as string} />;
}
