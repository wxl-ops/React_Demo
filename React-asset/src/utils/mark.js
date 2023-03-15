export default {
  getmark(mark) {
    if (mark) {
      let permissions = false;
      let markarr = JSON.parse(sessionStorage.getItem("markarr"));
      if (markarr) {
        markarr.forEach((item) => {
          if (item == mark) {
            permissions = true;
          }
        });
      }
      return permissions;
    } else {
      return true;
    }
  }
}
