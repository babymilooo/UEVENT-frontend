import UserStore from './userContext';
import { makeAutoObservable } from 'mobx';
class RootStore {
    userStore;

    constructor() {
        this.userStore = new UserStore(this);
        makeAutoObservable(this);
    }
}

export default RootStore;