// Random Index (RI) table according to Thomas L. Saaty
const RI_TABLE = {
  1: 0.00,
  2: 0.00,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49
};

/**
 * Generates all unique pairwise combinations for a list of items.
 * For n items, it returns n * (n - 1) / 2 combinations.
 * @param {Array} items - List of items (objects or strings)
 * @returns {Array} List of pairs { left, right }
 */
export function generatePairwiseCombinations(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push({
        left: items[i],
        right: items[j]
      });
    }
  }
  return pairs;
}

/**
 * Constructs an n x n reciprocal matrix from pairwise answers.
 * @param {Array<string>} itemCodes - Array of item codes (e.g. ['K1', 'K2', 'K3'])
 * @param {Object} answers - Answers object where keys are "leftCode-rightCode"
 * @returns {Array<Array<number>>} n x n matrix
 */
export function constructMatrix(itemCodes, answers) {
  const n = itemCodes.length;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(1));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const leftCode = itemCodes[i];
      const rightCode = itemCodes[j];
      const key = `${leftCode}-${rightCode}`;
      
      const answer = answers[key];
      if (answer) {
        let val = 1;
        const intensity = Number(answer.intensity) || 1;
        
        if (answer.selected === 'left') {
          val = intensity;
        } else if (answer.selected === 'right') {
          val = 1 / intensity;
        } // if equal, val = 1
        
        matrix[i][j] = val;
        matrix[j][i] = 1 / val;
      } else {
        // Default to equal if not answered yet
        matrix[i][j] = 1;
        matrix[j][i] = 1;
      }
    }
  }
  
  return matrix;
}

/**
 * Calculates local weights for a pairwise matrix using Geometric Mean Method.
 * @param {Array<Array<number>>} matrix - n x n reciprocal matrix
 * @returns {Array<number>} Normalized weights vector
 */
export function calculateAHPWeights(matrix) {
  const n = matrix.length;
  if (n === 0) return [];
  
  // 1. Calculate Geometric Mean for each row
  const geoMeans = [];
  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = 0; j < n; j++) {
      product *= matrix[i][j];
    }
    geoMeans.push(Math.pow(product, 1 / n));
  }
  
  // 2. Normalize Geometric Means to get weights
  const sumGeoMeans = geoMeans.reduce((sum, val) => sum + val, 0);
  
  if (sumGeoMeans === 0) {
    return Array(n).fill(1 / n); // Fallback to equal weights
  }
  
  const weights = geoMeans.map(val => val / sumGeoMeans);
  return weights;
}

/**
 * Calculates lambda_max, CI, and Consistency Ratio (CR).
 * @param {Array<Array<number>>} matrix - n x n reciprocal matrix
 * @param {Array<number>} weights - Normalized weights vector of length n
 * @returns {Object} { lambdaMax, ci, cr, isConsistent }
 */
export function calculateConsistencyRatio(matrix, weights) {
  const n = matrix.length;
  if (n <= 2) {
    return {
      lambdaMax: n,
      ci: 0,
      cr: 0,
      isConsistent: true
    };
  }
  
  // 1. Compute AW (Matrix-Vector multiplication)
  const aw = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      aw[i] += matrix[i][j] * weights[j];
    }
  }
  
  // 2. Compute lambda_i = aw_i / w_i and lambda_max as average
  let sumLambda = 0;
  for (let i = 0; i < n; i++) {
    if (weights[i] > 0) {
      sumLambda += aw[i] / weights[i];
    } else {
      sumLambda += n; // Avoid division by zero
    }
  }
  const lambdaMax = sumLambda / n;
  
  // 3. Compute CI
  const ci = (lambdaMax - n) / (n - 1);
  
  // 4. Look up RI
  const ri = RI_TABLE[n] || 1.49; // Default to 1.49 if n > 10
  
  // 5. Compute CR
  const cr = ri > 0 ? (ci / ri) : 0;
  
  return {
    lambdaMax: Number(lambdaMax.toFixed(4)),
    ci: Number(ci.toFixed(4)),
    cr: Number(cr.toFixed(4)),
    isConsistent: cr <= 0.10
  };
}

/**
 * Helper to compute full AHP weights and consistency for a set of items and answers.
 * @param {Array<string>} itemCodes 
 * @param {Object} answers 
 * @returns {Object} { weights: Array, lambdaMax, ci, cr, isConsistent }
 */
export function evaluateAHPSection(itemCodes, answers) {
  const matrix = constructMatrix(itemCodes, answers);
  const weights = calculateAHPWeights(matrix);
  const consistency = calculateConsistencyRatio(matrix, weights);
  
  // Map weights to item codes for convenience
  const weightsMap = {};
  itemCodes.forEach((code, idx) => {
    weightsMap[code] = weights[idx];
  });
  
  return {
    weights,
    weightsMap,
    ...consistency
  };
}
