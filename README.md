# Promise Stem

Promise Stem allows you to put together results from multiple separate JavaScript promise chains.

## Promise Tree

Promise Tree is another package I write. It takes a promise chain, and branch it out into multiple chains, thus enabling conditional promise usage. It's exactly the opposite to Promise Stem. You can find it in the following links.

### GitHub
https://github.com/shizongli94/promise-tree
### NPM
https://www.npmjs.com/package/promise-tree
###

## Installing

Simply install with npm

```
npm install --save promise-stem
```

## Quick Start
### Require
```
const Stem = require("promise-stem").Stem;
const glue = require("promise-stem").glue;
```
### Initialization
The constructor **Stem** takes two parameters *how_many* and *resolve_me*. *how_many* is an integer that specifies how may objects/values you wish to pass to the stem chain.
*resolve_me* is a boolean value which indicates if you want the stem chain to start with resolved or rejected state.
```
const stem = new Stem(2, true); 
const promise_left = new Promise((resolve, reject) => {
    /* your code */
});
const promise_right = new Promise((resolve, reject) => {
    /* your code */
});
```
### Start stemming using **glue**
```
promise_left
    .then(value => {
        console.log("left 1");
        value++;
        return value;
    })
    .then(value => {
        console.log('left 2');
        // glue.along(Stem) tells the program which Stem object to go to.
        // glue.use(name, value) tells the program what value you wish to use in stem chain and what name to be used to refer to it.
        glue.along(stem).use("left", value); 
        value++;
        return value;
    })
    .then(value => {
        console.log('left 3');
        value++;
        return value;
    });

promise_right
    .then(value => {
        console.log("right 1");
        value++;
        return value;
    })
    .then(value => {
        console.log('right 2');
        // another number wishes to join the stem
        glue.along(stem).use("right", value);
        value++;
        return value;
    })
    .then(value => {
        console.log('right 3');
        value++;
        return value;
    });

stem
    .then(set => { // set is a json object holding the values you pass in
        console.log("stem 1 right", set.right);
        console.log("stem 1 left", set.left);
        return set.right;
    })
    .then(value => {
        console.log("stem 2", value);
        return value;
    });
```
The output will be
```
left 1
right 1
left 2
right 2
left 3
stem 1 right 201
stem 1 left 101
right 3
stem 2 201

```
## API
### Stem - object
Include
```
const Stem = require("promise-stem").Stem;
```
Constructor - The constructor **Stem** takes two parameters *how_many* and *resolve_me*. *how_many* is an integer that specifies how may objects/values you wish to pass to the stem chain.
              *resolve_me* is a boolean value which indicates if you want the stem chain to start with resolved or rejected state.
```
const stem = new Stem(how_many, resolve_me);
```
Handlers - just like *then()* and *catch()* in Promise object.
```
stem
  .then((set) => { /* your code goes here */})
  .catch((reason) => { /* your code goes here */});
```
### Glue - JSON object
Include
```
const glue = require("promise-stem").glue;
```
Stem indicator
```
// Indicating which stem you wish to go to.
glue.along(stem) // must be passed with a Stem object. Otherwise TypeError is thrown
```
Value carrier 
```
glue.use(name, value); // name is string. Value is any value you want to pass to stem chain. Name will be used in stem chain to refer to the value you passed in.

```

## Attention!
To make stem chain work as expected, you must use **BOTH** *glue.along()* and *glue.use()* in a certain order: *glue.along()* first, then *glue.use()*. 
```
// In any of the cases below, stem chain won't work

// nothing will happen
stem.along(a_stem_that_is_yelling); 
// some random stem will be picked up and passed the value, 
// or worse, getting a nice little message on screen saying you can't access attribute on undefined.
stem.use("sleeping", shoot_at_random); 
// this will produce the same err as above
stem.use("still_sleeping", shoot_at_random).along(another_yelling_stem);
```
## Authors

* **Zongli Shi** - *Initial work* - [shizongli94](https://github.com/shizongli94)

## License

This project is licensed under the GNU General Public License v3.0
