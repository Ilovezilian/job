class Count {
    constructor (initValue) {
        this._initValue;
        this._add = (function() {
            var count = 0;
            return function() {return ++ count;}
        })();
    }
    get initValue() {
        return this._initValue;
    }
    set initValue(value) {
        this._initValue = value;
    }
    add() {
        return this._add();
    }
};
var d = new Date("2020-07-01");
var dateString = d.toString("YYYY-MM-DD");
console.log(dateString);
var count = new Count(0);
console.log(count.add());
console.log(count.add());
console.log(count.add());

