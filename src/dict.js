const KEYWORDS = ["ADD","MUL","SUB","RET","CALL","CALLR","XOR"];
const CONDITIONALS = ["JLE"];
const REGISTER_EXPRESSION = `\\b(R([0-9]|[1-2][0-9]|3[0-1]))\\b`;
const TAG_EXPRESSION = `\\b(([a-z]|[A-Z])(([A-Z]|[a-z]|[0-9])*)\\b:)`;
const VALUE_EXPRESSION = `(#\\b(([1-9]([0-9]*))|0)\\b)`;
const COMMENT_EXPRESSION = `;.*;`;



module.exports = { KEYWORDS, REGISTER_EXPRESSION, TAG_EXPRESSION, VALUE_EXPRESSION, CONDITIONALS, COMMENT_EXPRESSION };