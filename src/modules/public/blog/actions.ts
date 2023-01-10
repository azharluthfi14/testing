import { CommonError } from '../../types';
import { BLOGS_DATA, BLOGS_ERROR, BLOGS_FETCH } from './constants';

export interface BlogsPayload1 {
    id: String;
    cover: String;
    title: String;
    category: String;
    content: String;
    created_at: String;
    slug: String;
    url: String;
    created_at_f: String;
}

export interface BlogsFetch {
    type: typeof BLOGS_FETCH;
    payload: {
        type: string;
    }
}

export interface BlogsData {
    type: typeof BLOGS_DATA;
    payload: BlogsPayload1;
}

export interface BlogsError {
    type: typeof BLOGS_ERROR;
    error: CommonError;
}

export type BlogsAction =
    BlogsFetch
    | BlogsData
    | BlogsError;

export const blogsFetch = (payload: BlogsFetch['payload']): BlogsFetch => ({
    type: BLOGS_FETCH,
    payload,
});

export const blogsData = (payload: BlogsData['payload']): BlogsData => ({
    type: BLOGS_DATA,
    payload,
});

export const blogsError = (error: CommonError): BlogsError => ({
    type: BLOGS_ERROR,
    error,
});
