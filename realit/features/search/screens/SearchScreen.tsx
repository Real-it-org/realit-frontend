import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { searchUsers, UserSummary } from '@/services/search/search.service';

// Debounce helper
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export const SearchScreen = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Debounced search function
    const performSearch = useCallback(
        debounce(async (text: string) => {
            if (!text.trim()) {
                setResults([]);
                setLoading(false);
                return;
            }

            try {
                const data = await searchUsers(text);
                setResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setHasSearched(true);
            }
        }, 500),
        []
    );

    const handleSearchChange = (text: string) => {
        setQuery(text);
        if (text.trim()) {
            setLoading(true);
            performSearch(text);
        } else {
            setResults([]);
            setHasSearched(false);
        }
    };

    const renderItem = ({ item }: { item: UserSummary }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => router.push(`/profile/${item.id}`)}
        >
            <View style={styles.avatarContainer}>
                {item.avatar_url ? (
                    <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Ionicons name="person" size={20} color="#666" />
                    </View>
                )}
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                {item.display_name && (
                    <Text style={styles.displayName}>{item.display_name}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search for users..."
                        placeholderTextColor="#888"
                        value={query}
                        onChangeText={handleSearchChange}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearchChange('')}>
                            <Ionicons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.buttonPost} />
                </View>
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        hasSearched && query.trim() ? (
                            <View style={styles.centerContainer}>
                                <Text style={styles.emptyText}>No matching profiles found.</Text>
                            </View>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        paddingHorizontal: spacing.sm,
        height: 40,
    },
    searchIcon: {
        marginRight: spacing.xs,
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        paddingVertical: 0,
    },
    listContent: {
        padding: spacing.md,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarPlaceholder: {
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#555',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    displayName: {
        color: '#AAA',
        fontSize: 14,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing.xl,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
});
