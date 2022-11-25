var a = {
    "errcode": 0,
    "errmsg": "ok",
    "recordresult": [{}]
};
a.recordresult.forEach(e=>e.userCheckTimeStr = new Date(e.userCheckTime).toLocaleString());
a.recordresult.forEach(e=>e.workDateStr = new Date(e.workDate).toLocaleString());
a.recordresult.forEach(e=>e.gmtCreateStr = new Date(e.gmtCreate).toLocaleString());
a.recordresult.forEach(e=>e.gmtModifiedStr = new Date(e.gmtModified).toLocaleString());

console.log(a)