export default {
  getdictname(dictlist, id) {
    let dictname;
    dictlist.forEach((item) => {
      if (item.value == id) {
        dictname = item.name;
      }
    });
    return dictname;
  },
};
