'use strict';

function Stem (how_many, resolve_me){
    if (typeof resolve_me !== "boolean") throw new TypeError("Stem: second parameter must be Boolean");
    if (typeof how_many !== "number" || parseInt(how_many, 10) !== how_many) throw new TypeError("Stem: Must pass in integer");
    this.how_many = how_many;
    this.do_list = [];
    this.resolve_me = resolve_me;
    this.count = 0;
    this.bank = {};
    this.then = (onFulfilled, onRejected) => {
        this.do_list.push({
            name: "then",
            onFulfilled: onFulfilled,
            onRejected: onRejected
        });
        return this;
    };
    this.catch = (onRejected) => {
        this.do_list.push({
            name: "catch",
            onRejected:onRejected
        });
        return this;
    };
}


module.exports.Stem = Stem;
module.exports.glue = {
    current_stem: undefined,
    use : function(name, value){
        if (!(this.current_stem instanceof Stem)) throw new TypeError("glue: Tree stem is not an instance of Stem");
        if (typeof name !== "string") throw new TypeError("glue: Name must be a string");
        this.current_stem.bank[name] = value;
        this.current_stem.count++;
        if (this.current_stem.count >= this.current_stem.how_many){
            let promise = new Promise((resolve, reject)=>{
                if (this.current_stem.resolve_me){
                    resolve(this.current_stem.bank);
                }else{
                    reject(this.current_stem.bank);
                }
            });
            for (let i=0; i<this.current_stem.do_list.length; i++){
                if (this.current_stem.do_list[i].name == "then"){
                    const onFulfilled = this.current_stem.do_list[i].onFulfilled;
                    const onRejected = this.current_stem.do_list[i].onRejected;
                    promise = promise.then(onFulfilled, onRejected);
                }else{
                    const onRejected = this.current_stem.do_list[i].onRejected;
                    promise = promise.catch(onRejected);
                }
            }
            this.current_stem.do_list = [];
        }
    },
    along : function(stem){
        this.current_stem = stem;
        return this;
    }
};