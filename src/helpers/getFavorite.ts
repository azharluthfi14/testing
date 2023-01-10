import { User } from '../modules'

export const getFavorite = (user?: User) => {
    if(!user.email){
        return localStorage.getItem('favoriteMarket') || JSON.stringify([])
    }
    if(!user.data){
        return JSON.stringify([])
    }
    const data = user.data && JSON.parse(user.data);
    if(!data.favorite){
        return JSON.stringify([])
    }
    return JSON.stringify(data.favorite) || JSON.stringify([])
};
