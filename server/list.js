class UserStore {
  constructor(){
    this._data = [];
  }

  add(item){
    this._data.push(item);
  }

  get(id){
    return this._data.find(d => d.id === id);
  }

  size() {
    return this._data.length;
  }
}

const instance = new UserStore();
Object.freeze(instance);

export default instance;