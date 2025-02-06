/**
 * Sanitize the given string
 * @param {string} str
 * @returns {string}
 */
function sanitizeText(str) {
	return str.replace(/[^\w\s-]/g, "").trim();
}
