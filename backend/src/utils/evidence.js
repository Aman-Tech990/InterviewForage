const normalize = (text) =>
  String(text ?? '')
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const MIN_QUOTE_LENGTH = 4;

/**
 * Evaluations must cite the candidate's own words. A quote the candidate never wrote
 * is dropped, so feedback cannot rest on invented evidence.
 */
export function verifyEvidence(items, candidateResponse) {
  const haystack = normalize(candidateResponse);
  const verified = [];
  let unverifiedCount = 0;

  for (const item of items ?? []) {
    const quote = normalize(item?.quote);
    if (quote.length >= MIN_QUOTE_LENGTH && haystack.includes(quote)) {
      verified.push({ quote: String(item.quote).trim(), observation: String(item.observation ?? '').trim() });
    } else {
      unverifiedCount += 1;
    }
  }

  return { verified, unverifiedCount };
}
