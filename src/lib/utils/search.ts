import type { ProductWithBrand } from '$lib/types/entities';

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/**
 * Normalize brand parameter strings (removes leading/trailing spaces, %20, + signs, etc.)
 */
export function normalizeBrandParam(brand?: string | null): string {
	if (!brand) return '';
	let decoded = brand;
	try {
		decoded = decodeURIComponent(brand);
	} catch (e) {
		// ignore URI decode errors
	}
	return decoded
		.replace(/\+/g, ' ')
		.replace(/%20/g, ' ')
		.replace(/^[\s\+\%20]+|[\s\+\%20]+$/gi, '')
		.trim();
}

/**
 * Remove diacritics / accents from a string (e.g. "élixir" -> "elixir")
 */
export function removeAccents(str: string): string {
	if (!str) return '';
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Tokenize and sanitize a search query into safe words.
 * Strips out PostgREST special syntax characters to avoid query errors.
 */
export function tokenizeSearchQuery(rawQuery: string): string[] {
	if (!rawQuery) return [];

	// Replace PostgREST syntax and special characters with spaces
	const sanitized = rawQuery
		.replace(/[,()::"'%_\\\/\[\]{}!?=<>]/g, ' ')
		.trim();

	if (!sanitized) return [];

	// Split by whitespace and filter out empty strings
	return sanitized
		.split(/\s+/)
		.map((t) => t.trim())
		.filter((t) => t.length > 0);
}

/**
 * Sanitize a single token to be safely inserted into PostgREST ilike pattern
 */
export function sanitizeTokenForPostgrest(token: string): string {
	return token.replace(/[%_\\(),.]/g, '');
}

/**
 * Calculate relevance score for a product against a search query
 */
export function calculateRelevanceScore(
	product: ProductWithBrand,
	rawQuery: string,
	tokens: string[]
): number {
	if (!rawQuery || tokens.length === 0) return 0;

	const normQuery = removeAccents(rawQuery.toLowerCase().trim());
	const prodNameNorm = removeAccents((product.name || '').toLowerCase());
	const brandNameNorm = removeAccents((product.brand || product.brands?.name || '').toLowerCase());
	const descNorm = removeAccents((product.description || '').toLowerCase());
	const typeNorm = removeAccents((product.type || '').toLowerCase());
	const categoryNorm = removeAccents((product.category || '').toLowerCase());
	const scentFamilyNorm = removeAccents((product.scent_family || '').toLowerCase());
	const occasionNorm = removeAccents((product.occasion || '').toLowerCase());
	const genderNorm = removeAccents((product.gender || '').toLowerCase());

	let score = 0;

	// 1. Exact full query matches
	if (prodNameNorm === normQuery) {
		score += 300;
	} else if (brandNameNorm === normQuery) {
		score += 250;
	} else if (
		`${brandNameNorm} ${prodNameNorm}` === normQuery ||
		`${prodNameNorm} ${brandNameNorm}` === normQuery
	) {
		score += 280;
	}

	// 2. Prefix and substring matches on product name / brand
	if (prodNameNorm.startsWith(normQuery)) {
		score += 200;
	} else if (prodNameNorm.includes(normQuery)) {
		score += 150;
	}

	if (brandNameNorm.startsWith(normQuery)) {
		score += 180;
	} else if (brandNameNorm.includes(normQuery)) {
		score += 130;
	}

	// 3. Check individual tokens matching across fields
	let tokensMatchedCount = 0;

	for (const token of tokens) {
		const t = removeAccents(token.toLowerCase());
		let tokenScore = 0;

		if (prodNameNorm.includes(t)) {
			tokenScore += 50;
			if (prodNameNorm.startsWith(t)) tokenScore += 20;
		}

		if (brandNameNorm.includes(t)) {
			tokenScore += 45;
			if (brandNameNorm.startsWith(t)) tokenScore += 15;
		}

		if (typeNorm.includes(t) || categoryNorm.includes(t)) {
			tokenScore += 25;
		}

		if (scentFamilyNorm.includes(t) || occasionNorm.includes(t) || genderNorm.includes(t)) {
			tokenScore += 20;
		}

		if (descNorm.includes(t)) {
			tokenScore += 10;
		}

		if (tokenScore > 0) {
			tokensMatchedCount++;
			score += tokenScore;
		}
	}

	// Boost score if ALL tokens matched anywhere in the product text
	if (tokensMatchedCount === tokens.length && tokens.length > 1) {
		score += 100;
	} else if (tokensMatchedCount === 0) {
		// If none of the tokens matched, score is 0
		return 0;
	}

	return score;
}

/**
 * Filter and rank an array of products in-memory using tokenized relevance search
 */
export function filterAndRankProducts(
	products: ProductWithBrand[],
	rawQuery: string
): ProductWithBrand[] {
	if (!rawQuery || !rawQuery.trim()) {
		return products;
	}

	const tokens = tokenizeSearchQuery(rawQuery);
	if (tokens.length === 0) {
		return products;
	}

	const scoredProducts: { product: ProductWithBrand; score: number }[] = [];

	for (const product of products) {
		const score = calculateRelevanceScore(product, rawQuery, tokens);
		if (score > 0) {
			scoredProducts.push({ product, score });
		}
	}

	scoredProducts.sort((a, b) => b.score - a.score || b.product.id - a.product.id);

	return scoredProducts.map((item) => item.product);
}
