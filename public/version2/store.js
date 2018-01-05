'use strict';

class Store {
  // Setting all the store properties to null is not strictly necessary
  //  but it does provide a nice way of documenting the fields
  constructor() {
    this.list = null; // holds the list of stories from the API
    this.item = null; // holds the currently selected item
    this.view = null;
  }

  insert(doc){
    this.item = doc;
    this.list.push(doc);
  }

  findById(id) {
    return this.list.find(item => item.id === Number(id));
  }  

  findByIdAndRemove(id) {
    this.list = this.list.filter(item => item.id !== Number(id));
  }

  findByIdAndUpdate(doc) {
    this.item = doc;
    let obj = this.findById(Number(doc.id));
    if (obj) {
      Object.assign(obj, doc);
    }
    return obj;
  }

}
