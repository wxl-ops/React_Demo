export default {
  getformat(startTime) {
    let date = new Date(startTime * 1000);
    let YY = date.getFullYear();
    let MM =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    let DD = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    let hh = date.getHours() < 10 ? `0${date.getHours() + 1}` : date.getHours();
    let mm =
      date.getMinutes() < 10 ? `0${date.getMinutes() + 1}` : date.getMinutes();
    let ss =
      date.getSeconds() < 10 ? `0${date.getSeconds() + 1}` : date.getSeconds();
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
  },
};
