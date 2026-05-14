export function computeSMA(
  closes: number[],
  timestamps: number[],
  period: number
): { t: number[]; values: number[] } {
  if (closes.length < period) {
    return { t: [], values: [] };
  }

  const t: number[] = [];
  const values: number[] = [];

  for (let i = period - 1; i < closes.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += closes[j];
    }
    const sma = sum / period;
    t.push(timestamps[i]);
    values.push(sma);
  }

  return { t, values };
}

export function computeRSI(
  closes: number[],
  timestamps: number[],
  period: number
): { t: number[]; values: number[] } {
  if (closes.length < period + 1) {
    return { t: [], values: [] };
  }

  const changes: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 0; i < changes.length; i++) {
    if (changes[i] > 0) {
      gains.push(changes[i]);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(changes[i]));
    }
  }

  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    avgGain += gains[i];
    avgLoss += losses[i];
  }
  avgGain /= period;
  avgLoss /= period;

  const t: number[] = [];
  const values: number[] = [];

  for (let i = period; i < closes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    let rsi: number;
    if (avgLoss === 0) {
      rsi = avgGain === 0 ? 50 : 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi = 100 - 100 / (1 + rs);
    }

    t.push(timestamps[i]);
    values.push(rsi);
  }

  return { t, values };
}
