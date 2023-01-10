import { CommonState } from '../../types';
import { BlogsAction } from './actions';
import { BLOGS_DATA, BLOGS_ERROR, BLOGS_FETCH } from './constants';

export interface BlogsPayload {
    id: String;
    cover: String;
    title: String;
    category: String;
    content: String;
    created_at: String;
    slug: String;
    url: String;
    created_at_f: String;
    loading?: Boolean;
}

export interface BlogsState extends CommonState {
    data?: BlogsPayload[];
    loading: boolean;
}

export const initialBlogsState: BlogsState = {
    loading: false,
};

export const blogsReducer = (state = initialBlogsState, action: BlogsAction) => {   
    switch (action.type) {
        case BLOGS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case BLOGS_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case BLOGS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
