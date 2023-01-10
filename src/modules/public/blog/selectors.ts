import { RootState } from '../../';
export interface BlogsPayload2 {
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

export const selectBlogs = (state: RootState): BlogsPayload2[] | [] =>
    state.public.blogs.data;

export const selectBlogsLoading = (state: RootState): boolean =>
    state.public.blogs.loading;
