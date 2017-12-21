const DEFAULT_EQUIVALENCE = function(a, b) {
  return a === b;
};

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

class CustomEditDistance {
  constructor(costs, equivalence) {
    this._equivalence = equivalence || DEFAULT_EQUIVALENCE;
    this._costs = Object.assign({}, LEVENSHTEIN, costs);
  }

  editCosts(from, to) {
    // the cost of edits to tranform prefixes of 'from' into prefixes of 'to'.
    const cost = Array(from.length + 1).fill().map(() => Array(to.length + 1).fill(0));

    for (var i = 1; i <= from.length; i++) {
      // cost of deleting i characters from the start of 'from'.
      cost[i][0] = cost[i - 1][0] + this._costs.getRemoveCost(from[i - 1]);
    };

    for (var j = 1; j <= to.length; j++) {
      // cost of adding i characters to the start of 'from'.
      cost[0][j] = cost[0][j - 1] + this._costs.getInsertCost(to[j - 1]);
    }

    for (var j = 1; j <= to.length; j++) { // eslint-disable-line no-redeclare
      for (var i = 1; i <= from.length; i++) { // eslint-disable-line no-redeclare
        if (this._equivalence(from[i - 1], to[j - 1])) {
          cost[i][j] = cost[i - 1][j - 1] + this._costs.getKeepCost(to[j - 1]);
        } else {
          const removeCost = cost[i - 1][j] + this._costs.getRemoveCost(from[i - 1]);
          const insertCost = cost[i][j - 1] + this._costs.getInsertCost(to[j - 1]);
          const substitutionCost = cost[i - 1][j - 1] + this._costs.getSubstituteCost(from[i - 1], to[j - 1]);
          cost[i][j] = Math.min(removeCost, insertCost, substitutionCost);
        }
      }
    }

    return cost;
  }

  editDistance(from, to) {
    const cost = this.editCosts(from, to);
    return cost[from.length][to.length];
  }
}

module.exports = { LEVENSHTEIN, CustomEditDistance };
