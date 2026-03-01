import { client } from '../api/client';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';

// Types matching backend DTOs
export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video'
}

export interface PostMediaItemDto {
    media_type: MediaType;
    size_bytes: number;
    filename: string;
}

export interface CreatePostDto {
    heading?: string;
    description?: string;
    verification_status?: 'verified' | 'ai' | 'unverified';
    media: PostMediaItemDto[];
}

export interface PostMediaUploadDto {
    asset_id: string;
    upload_url: string;
    object_key: string;
}

export interface CreatePostResponseDto {
    post_id: string;
    media: PostMediaUploadDto[];
}

export interface ConfirmPostMediaDto {
    post_id: string;
    uploaded_asset_ids: string[];
}

export const postsService = {
    /**
     * Step 1: Create Post and get presigned URLs
     */
    createPost: async (data: CreatePostDto): Promise<CreatePostResponseDto> => {
        const response = await client.post<CreatePostResponseDto>('/post', data);
        return response.data;
    },

    /**
     * Step 2: Upload Media to Presigned URL
     */
    uploadMedia: async (uploadUrl: string, fileUri: string, mimeType: string) => {
        console.log(`[PostService] Starting upload: ${fileUri} -> ${uploadUrl}`);
        try {
            const response = await uploadAsync(uploadUrl, fileUri, {
                httpMethod: 'PUT',
                uploadType: FileSystemUploadType.BINARY_CONTENT,
                mimeType: mimeType,
            });
            console.log(`[PostService] Upload complete. Status: ${response.status}`);

            if (response.status !== 200) {
                console.error(`[PostService] Upload failed body:`, response.body);
                throw new Error(`Failed to upload media: ${response.body}`);
            }

            return response;
        } catch (error) {
            console.error(`[PostService] Upload error:`, error);
            throw error;
        }
    },

    /**
     * Step 3: Confirm Upload Completion
     */
    confirmPost: async (data: ConfirmPostMediaDto) => {
        const response = await client.post('/post/confirm', data);
        return response.data;
    }
};
