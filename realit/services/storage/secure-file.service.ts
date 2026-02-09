import { Paths, File, Directory } from 'expo-file-system';

const SECURE_FOLDER_NAME = 'secure_captures';
// Create a reference to the secure directory (does not create it on disk yet)
const secureDir = new Directory(Paths.document, SECURE_FOLDER_NAME);

/**
 * Ensures the secure directory exists on disk.
 */
const ensureDirectoryExists = () => {
    if (!secureDir.exists) {
        secureDir.create();
    }
};

export const secureFileService = {
    /**
     * Moves a file from a temporary URI (e.g., camera cache) to the secure document directory.
     * Returns the new secure URI.
     */
    async saveCapture(tempUri: string): Promise<string> {
        try {
            ensureDirectoryExists(); // Synchronous check/create in new API

            // Create a reference to the source file
            const sourceFile = new File(tempUri);

            // Generate unique filename
            const timestamp = new Date().getTime();
            const extension = tempUri.split('.').pop() || 'jpg';
            const newFileName = `capture_${timestamp}.${extension}`;

            // Create a reference to the destination file
            const destFile = new File(secureDir, newFileName);

            // Move the source file to the destination
            sourceFile.move(destFile);

            console.log('File secured at:', destFile.uri);
            return destFile.uri;
        } catch (error) {
            console.error('Error saving capture securely:', error);
            throw new Error('Failed to secure capture');
        }
    },

    /**
     * Lists all files in the secure directory.
     */
    async getCaptures(): Promise<string[]> {
        try {
            ensureDirectoryExists();

            // list() returns (File | Directory)[]
            const items = secureDir.list();

            // Filter only files and return their URIs
            return items
                .filter(item => item instanceof File)
                .map(item => item.uri);
        } catch (error) {
            console.error('Error listing captures:', error);
            return [];
        }
    },

    /**
     * Deletes a secure capture by its URI.
     */
    async deleteCapture(uri: string): Promise<void> {
        try {
            const file = new File(uri);
            if (file.exists) {
                file.delete();
                console.log('File deleted:', uri);
            }
        } catch (error) {
            console.error('Error deleting capture:', error);
            throw new Error('Failed to delete capture');
        }
    }
};
