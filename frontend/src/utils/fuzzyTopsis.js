// Fuzzy TOPSIS ranking (Chen, 2000) using triangular fuzzy numbers (TFNs).
//
// Each crisp listing attribute (price, bedroom, bathroom, ...) is fuzzified
// into a TFN [l, m, u] to model the imprecision inherent in comparing
// listings ("around this price", not exactly this price). Each criterion
// also carries a fuzzy importance WEIGHT - how much it should influence the
// ranking relative to the others - expressed either as a linguistic term
// (low/medium/high/very_high) or an explicit TFN. The fuzzy decision matrix
// is linearly normalized per criterion, weighted, and each alternative is
// ranked by its closeness coefficient to the fuzzy positive/negative ideal
// solutions.

const DEFAULT_FUZZINESS = 0.1; // +-10% spread around the crisp value

// Standard 4-level linguistic importance scale mapped to triangular fuzzy
// numbers over [0, 1], each overlapping its neighbor by half - the usual way
// fuzzy TOPSIS turns a qualitative "how much does this matter to me" into a
// weight that can be multiplied into the decision matrix.
export const LINGUISTIC_WEIGHTS = {
  low: [0, 0.25, 0.5],
  medium: [0.25, 0.5, 0.75],
  high: [0.5, 0.75, 1],
  very_high: [0.75, 1, 1],
};

const resolveWeight = (weight) => {
  if (Array.isArray(weight)) return weight;
  return LINGUISTIC_WEIGHTS[weight] || LINGUISTIC_WEIGHTS.medium;
};

const toTFN = (value, fuzziness) => [
  value * (1 - fuzziness),
  value,
  value * (1 + fuzziness),
];

// Vertex method distance between two TFNs.
const tfnDistance = (a, b) =>
  Math.sqrt(((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) / 3);

const safeDivide = (numerator, denominator) =>
  denominator === 0 ? 0 : numerator / denominator;

/**
 * @param {object[]} data - alternatives to rank (e.g. listings)
 * @param {object} preferences
 * @param {{
 *   key: string,
 *   behavior: 'min' | 'max' | 'match',
 *   target?: any,
 *   weight?: 'low' | 'medium' | 'high' | 'very_high' | [number, number, number],
 * }[]} preferences.items
 *   'min'/'max' criteria are numeric (e.g. price, bedroom). 'match' criteria
 *   are categorical (e.g. city): an alternative scores 1 if its value
 *   strictly equals `target`, 0 otherwise - a crisp fact, not fuzzified with
 *   a spread. `weight` defaults to 'medium' (equal importance) when omitted.
 * @param {{ fuzziness?: number }} [options]
 * @returns data, sorted descending by fuzzy closeness coefficient, each item
 *   annotated with distanceToBest, distanceToWorst and closeness.
 */
export function fuzzyTopsis(data, preferences, options = {}) {
  const { fuzziness = DEFAULT_FUZZINESS } = options;
  const items = preferences.items;

  // Fuzzy decision matrix: criterion key -> one TFN per alternative.
  const fuzzyMatrix = items.reduce((acc, { key, behavior, target }) => {
    acc[key] = data.map((d) => {
      if (behavior === "match") {
        const score = d[key] === target ? 1 : 0;
        return [score, score, score];
      }
      return toTFN(Number(d[key]), fuzziness);
    });
    return acc;
  }, {});

  // Linear normalization keeps every criterion's best value at 1 and worst
  // at 0 regardless of its original units or min/max direction. 'match'
  // criteria are already a 0/1 score, so they pass through unchanged.
  const normalizedMatrix = items.reduce((acc, { key, behavior }) => {
    const column = fuzzyMatrix[key];
    if (behavior === "match") {
      acc[key] = column;
    } else if (behavior === "max") {
      const uStar = Math.max(...column.map(([, , u]) => u));
      acc[key] = column.map(([l, m, u]) => [
        safeDivide(l, uStar),
        safeDivide(m, uStar),
        safeDivide(u, uStar),
      ]);
    } else {
      const lStar = Math.min(...column.map(([l]) => l));
      acc[key] = column.map(([l, m, u]) => [
        safeDivide(lStar, u),
        safeDivide(lStar, m),
        safeDivide(lStar, l),
      ]);
    }
    return acc;
  }, {});

  // Weighted normalized fuzzy decision matrix.
  const weights = items.reduce((acc, { key, weight }) => {
    acc[key] = resolveWeight(weight);
    return acc;
  }, {});

  const weightedMatrix = items.reduce((acc, { key }) => {
    const weight = weights[key];
    acc[key] = normalizedMatrix[key].map(([l, m, u]) => [
      l * weight[0],
      m * weight[1],
      u * weight[2],
    ]);
    return acc;
  }, {});

  // Normalized values never exceed [1, 1, 1] before weighting, so the fuzzy
  // positive ideal solution per criterion is simply its weight, and the
  // fuzzy negative ideal solution is [0, 0, 0].
  const fpis = items.reduce((acc, { key }) => {
    acc[key] = weights[key];
    return acc;
  }, {});
  const fnis = items.reduce((acc, { key }) => {
    acc[key] = [0, 0, 0];
    return acc;
  }, {});

  const ranked = data.map((item, index) => {
    let distanceToBest = 0;
    let distanceToWorst = 0;

    items.forEach(({ key }) => {
      const value = weightedMatrix[key][index];
      distanceToBest += tfnDistance(value, fpis[key]);
      distanceToWorst += tfnDistance(value, fnis[key]);
    });

    const closeness = safeDivide(distanceToWorst, distanceToBest + distanceToWorst);

    return { ...item, distanceToBest, distanceToWorst, closeness };
  });

  return ranked.sort((a, b) => b.closeness - a.closeness);
}

// Numeric criteria this app currently supports, and which direction is
// "better" for each. City is handled separately below since it's
// categorical (a 'match' criterion), not min/max.
const NUMERIC_CRITERIA = [
  { key: "price", behavior: "min" },
  { key: "bedroom", behavior: "max" },
  { key: "bathroom", behavior: "max" },
];

/**
 * Turns the UserCriteria row returned by the backend (booleans + linguistic
 * weights) into the `preferences.items` shape `fuzzyTopsis` expects,
 * including only the criteria the user opted into. City is deliberately
 * excluded here: it's a hard filter applied before ranking (see
 * Recommended.jsx), not a weighted criterion - by the time fuzzyTopsis runs,
 * every alternative is already in the same city, so a city "weight" would be
 * meaningless.
 */
export function buildPreferenceItems(userPreferences) {
  if (!userPreferences) return [];

  return NUMERIC_CRITERIA.filter(({ key }) => userPreferences[key]).map(
    ({ key, behavior }) => ({
      key,
      behavior,
      weight: userPreferences[`${key}_weight`],
    })
  );
}
