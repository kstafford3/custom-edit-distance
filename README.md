# Custom Edit Distance<sup id="a1">[1](#f1)
### *The usual algorithm<sup id="a2">[2](#f2)</sup> with customizable costs.*

# Install
```sh
npm install custom-edit-distance
```

# Calculate
```js
const defaultCalculator = new CustomEditDistance();
defaultCalculator.editDistance('sitting', 'kitten').should.equal(3);
```

# Customize Costs
```js
const LEVENSHTEIN = {
  getKeepCost(unchangedValue) {
    return 0;
  },
  getInsertCost(insertedValue) {
    return 1;
  },
  getRemoveCost(removedValue) {
    return 1;
  },
  getSubstituteCost(fromValue, toValue) {
    return 1;
  },
};
const defaultCalculator = new CustomEditDistance(LEVENSHTEIN);
```
For convenience, we default to the Levenshtein<sup id="a3">[3](#f3)</sup> distance costs. We also export it as LEVENSHTEIN.

# Customize Equivalence
```js
const equivalence = function(a, b) {
  a == b; // Only check for abstract equivalence
};

const defaultCalculator = new CustomEditDistance(null, equivalence);
```
For convenience we default to strict equality (===).

# Sequences don't have to be Strings
```js
const defaultCalculator = new CustomEditDistance();
defaultCalculator.editDistance([1, 2, 3], [1, 4, 3]).should.equal(1);
```

This is where defining cost can shine:
```js
const valueDistanceCalculator = new CustomEditDistance({
  getInsertCost(insertedValue) {
    return insertedValue;
  },
  getRemoveCost(removedValue) {
    return removedValue;
  },
  getSubstituteCost(fromValue, toValue) {
    return Math.abs(toValue - fromValue);
  },
});
valueDistanceCalculator.editDistance([2, 3, 4], [1, 2, 3]).should.equal(3);
```

# Reference
<a id="f1"/>[Edit Distance](https://en.wikipedia.org/wiki/Edit_distance) [↩](#a1)

<a id="f2"/>[The Wagner-Fischer Algorithm](https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm) [↩](#a2)

<a id="f3"/>[Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) [↩](#a3)
