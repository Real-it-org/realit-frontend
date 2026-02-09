import { SearchScreen } from '@/features/search/screens/SearchScreen';
import { Stack } from 'expo-router';

export default function Search() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SearchScreen />
        </>
    );
}
