import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { blogsData, blogsError, BlogsFetch } from '../actions';
import axios from 'axios';

async function fetchNews(category) {
    
    const sURL = `https://nagaexchange.co.id/api/blog/${category}`
    const config = {headers: { Authorization: 'auth_key YWtzZV9ibG9nX251c2E=' }};
    const result = await axios.get(sURL,config)   
    return result.data.data    
  }

export function* blogsSaga(action: BlogsFetch) {
    try {
        const payload = action.payload        
        const response = yield call(fetchNews, payload)                
        yield put(blogsData(response))
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: blogsError,
            },
        }));
    }
}
