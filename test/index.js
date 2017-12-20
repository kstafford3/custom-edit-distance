require('chai').should();
const { CustomEditDistance } = require('../lib/index');

describe('CustomEditDistance', function() {
  describe('for string values', function() {
    describe('for default values (Levenshtein distance costs and default (===) for equivalence)', function() {
      const defaultCalculator = new CustomEditDistance();

      it(`should calculate edit distance of 3 between 'sitting' and 'kitten'`, function() {
        defaultCalculator.editDistance('sitting', 'kitten').should.equal(3);
      });

      it(`should detect no distance between '' and ''`, function() {
        defaultCalculator.editDistance('', '').should.equal(0);
      });

      it(`should detect no distance between 'a' and 'a'`, function() {
        defaultCalculator.editDistance('a', 'a').should.equal(0);
      });

      it(`should detect a distance of 1 between 'a' and ''`, function() {
        defaultCalculator.editDistance('a', '').should.equal(1);
      });

      it(`should detect a distance of 1 between '' and 'a'`, function() {
        defaultCalculator.editDistance('', 'a').should.equal(1);
      });

      it(`should detect a distance of 2 between 'a' and 'b'`, function() {
        defaultCalculator.editDistance('a', 'b').should.equal(1);
      });

      it(`should detect a distance of 1 between 'alice' and 'lice'`, function() {
        defaultCalculator.editDistance('alice', 'lice').should.equal(1);
      });

      it(`should detect a distance of 1 between 'lice' and 'alice'`, function() {
        defaultCalculator.editDistance('lice', 'alice').should.equal(1);
      });

      it(`should detect a distance of 1 between 'alice' and 'blice'`, function() {
        defaultCalculator.editDistance('alice', 'blice').should.equal(1);
      });

      it(`should detect a distance of 1 between 'alice' and 'alic'`, function() {
        defaultCalculator.editDistance('alice', 'alic').should.equal(1);
      });

      it(`should detect a distance of 1 between 'alic' and 'alice'`, function() {
        defaultCalculator.editDistance('alic', 'alice').should.equal(1);
      });

      it(`should detect a distance of 1 between 'alice' and 'alicf'`, function() {
        defaultCalculator.editDistance('alice', 'alicf').should.equal(1);
      });
    });

    describe('for a distance function where keeps are infinitely expensive', function() {
      const expensiveKeepCalculator = new CustomEditDistance({
        getKeepCost() {
          return Infinity;
        },
      });

      it(`should detect no distance between '' and ''`, function() {
        expensiveKeepCalculator.editDistance('', '').should.equal(0);
      });

      it(`should detect no distance between 'a' and 'a'`, function() {
        expensiveKeepCalculator.editDistance('a', 'a').should.equal(Infinity);
      });

      it(`should detect a distance of infinity between 'a' and ''`, function() {
        expensiveKeepCalculator.editDistance('a', '').should.equal(1);
      });

      it(`should detect a distance of 1 between '' and 'a'`, function() {
        expensiveKeepCalculator.editDistance('', 'a').should.equal(1);
      });

      it(`should detect a distance of 2 between 'a' and 'b'`, function() {
        expensiveKeepCalculator.editDistance('a', 'b').should.equal(1);
      });
    });

    describe('for a distance function where deletes are infinitely expensive', function() {
      const expensiveDeleteCalculator = new CustomEditDistance({
        getRemoveCost() {
          return Infinity;
        },
      });

      it(`should detect no distance between '' and ''`, function() {
        expensiveDeleteCalculator.editDistance('', '').should.equal(0);
      });

      it(`should detect no distance between 'a' and 'a'`, function() {
        expensiveDeleteCalculator.editDistance('a', 'a').should.equal(0);
      });

      it(`should detect a distance of infinity between 'a' and ''`, function() {
        expensiveDeleteCalculator.editDistance('a', '').should.equal(Infinity);
      });

      it(`should detect a distance of 1 between '' and 'a'`, function() {
        expensiveDeleteCalculator.editDistance('', 'a').should.equal(1);
      });

      it(`should detect a distance of 2 between 'a' and 'b'`, function() {
        expensiveDeleteCalculator.editDistance('a', 'b').should.equal(1);
      });
    });

    describe('for a distance function where inserts are infinitely expensive', function() {
      const expensiveInsertCalculator = new CustomEditDistance({
        getInsertCost() {
          return Infinity;
        },
      });

      it(`should detect no distance between '' and ''`, function() {
        expensiveInsertCalculator.editDistance('', '').should.equal(0);
      });

      it(`should detect no distance between 'a' and 'a'`, function() {
        expensiveInsertCalculator.editDistance('a', 'a').should.equal(0);
      });

      it(`should detect a distance of infinity between 'a' and ''`, function() {
        expensiveInsertCalculator.editDistance('a', '').should.equal(1);
      });

      it(`should detect a distance of 1 between '' and 'a'`, function() {
        expensiveInsertCalculator.editDistance('', 'a').should.equal(Infinity);
      });

      it(`should detect a distance of 2 between 'a' and 'b'`, function() {
        expensiveInsertCalculator.editDistance('a', 'b').should.equal(1);
      });
    });

    describe('for a distance function where subsitutions are infinitely expensive', function() {
      const expensiveSubstituteCalculator = new CustomEditDistance({
        getSubstituteCost() {
          return Infinity;
        },
      });

      it(`should detect no distance between '' and ''`, function() {
        expensiveSubstituteCalculator.editDistance('', '').should.equal(0);
      });

      it(`should detect no distance between 'a' and 'a'`, function() {
        expensiveSubstituteCalculator.editDistance('a', 'a').should.equal(0);
      });

      it(`should detect a distance of infinity between 'a' and ''`, function() {
        expensiveSubstituteCalculator.editDistance('a', '').should.equal(1);
      });

      it(`should detect a distance of 1 between '' and 'a'`, function() {
        expensiveSubstituteCalculator.editDistance('', 'a').should.equal(1);
      });

      it(`should detect a distance of 2 between 'a' and 'b'`, function() {
        // tricky tricky; delete and insert instead of substitution.
        expensiveSubstituteCalculator.editDistance('a', 'b').should.equal(2);
      });
    });

    describe('when defining equivalence', function() {
      const alwaysEquivalent = function(a, b) {
        return true;
      };
      const alwaysEquivalentCalculator = new CustomEditDistance(null, alwaysEquivalent);

      const neverEquivalent = function(a, b) {
        return false;
      };
      const neverEquivalentCalculator = new CustomEditDistance(null, neverEquivalent);

      it(`as "always equivalent" should detect a distance of 0 between 'a' and 'b'`, function() {
        alwaysEquivalentCalculator.editDistance('a', 'b').should.equal(0);
      });

      it(`as "never equivalent" should detect a distance of 1 between 'a' and 'a'`, function() {
        neverEquivalentCalculator.editDistance('a', 'a').should.equal(1);
      });
    });
  });

  describe('for non-string sequences', function() {
    describe('for default parameters', function() {
      const defaultCalculator = new CustomEditDistance();
      it(`should calculate edit distance of 0 between [ ] and [ ]`, function() {
        defaultCalculator.editDistance([], []).should.equal(0);
      });

      it(`should calculate edit distance of 0 between [ 1 ] and [ 1 ]`, function() {
        defaultCalculator.editDistance([1], [1]).should.equal(0);
      });

      it(`should calculate edit distance of 1 between [ 1 ] and [ ]`, function() {
        defaultCalculator.editDistance([1], []).should.equal(1);
      });

      it(`should calculate edit distance of 1 between [ ] and [ 1 ]`, function() {
        defaultCalculator.editDistance([], [1]).should.equal(1);
      });

      it(`should calculate edit distance of 1 between [ 1 ] and [ 2 ]`, function() {
        defaultCalculator.editDistance([1], [2]).should.equal(1);
      });

      it(`should calculate edit distance of 1 between [ 1, 2, 3 ] and [ 1, 4, 3 ]`, function() {
        defaultCalculator.editDistance([1, 2, 3], [1, 4, 3]).should.equal(1);
      });
    });

    describe(`with customized cost functions`, function() {
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

      it(`should calculate edit distance of 0 between [ ] and [ ]`, function() {
        valueDistanceCalculator.editDistance([], []).should.equal(0);
      });

      it(`should calculate edit distance of 0 between [ 1 ] and [ 1 ]`, function() {
        valueDistanceCalculator.editDistance([2], [2]).should.equal(0);
      });

      it(`should calculate edit distance of 2 between [ 2 ] and [ ]`, function() {
        valueDistanceCalculator.editDistance([2], []).should.equal(2);
      });

      it(`should calculate edit distance of 2 between [ ] and [ 2 ]`, function() {
        valueDistanceCalculator.editDistance([], [2]).should.equal(2);
      });

      it(`should calculate edit distance of 4 between [ 1 ] and [ 5 ]`, function() {
        valueDistanceCalculator.editDistance([1], [5]).should.equal(4);
      });

      it(`should calculate edit distance of 2 between [ 2, 3, 4 ] and [ 1, 2, 3 ]`, function() {
        valueDistanceCalculator.editDistance([2, 3, 4], [1, 2, 3]).should.equal(3);
      });
    });
  });
});
