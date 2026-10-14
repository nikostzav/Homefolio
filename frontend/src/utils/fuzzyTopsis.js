// Fuzzy TOPSIS ranking (Chen, 2000) using triangular fuzzy numbers (TFNs).
//
// Each crisp listing attribute (price, bedroom, bathroom, ...) is fuzzified
// into a TFN [l, m, u] to model the imprecision inherent in comparing
// listings ("around this price", not exactly this price). The fuzzy
// decision matrix is then linearly normalized per criterion, weighted, and
// each alternative is ranked by its closeness coefficient to the fuzzy
// positive/negative ideal solutions.

const DEFAULT_FUZZINESS = 0.1; // +-10% spread around the crisp value

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
 * @param {{ key: string, behavior: 'min' | 'max', weight?: [number, number, number] }[]} preferences.items
 * @param {{ fuzziness?: number }} [options]
 * @returns data, sorted descending by fuzzy closeness coefficient, each item
 *   annotated with distanceToBest, distanceToWorst and closeness.
 */
export function fuzzyTopsis(data, preferences, options = {}) {
  const { fuzziness = DEFAULT_FUZZINESS } = options;
  const items = preferences.items;

  // Fuzzy decision matrix: criterion key -> one TFN per alternative.
  const fuzzyMatrix = items.reduce((acc, { key }) => {
    acc[key] = data.map((d) => toTFN(Number(d[key]), fuzziness));
    return acc;
  }, {});

  // Linear normalization keeps every criterion's best value at 1 and worst
  // at 0 regardless of its original units or min/max direction.
  const normalizedMatrix = items.reduce((acc, { key, behavior }) => {
    const column = fuzzyMatrix[key];
    if (behavior === "max") {
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
  const weightedMatrix = items.reduce((acc, { key, weight = [1, 1, 1] }) => {
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
  const fpis = items.reduce((acc, { key, weight = [1, 1, 1] }) => {
    acc[key] = weight;
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
