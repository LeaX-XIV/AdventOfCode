// https://adventofcode.com/2020/day/19
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

typedef struct {
	int32 nonTerminal[2][2];
	uint32 pos;
	uint8 isTerminal;
	uint8 isStart;
	char terminal;
} rule;

void to_normal_form(rule* grammar);
uint8 CYK(rule* grammar, char* string);

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 2, 0);

	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	// p2 = part2(rows);

	printf("Part 1: %d\n", p1);	// 107
	// printf("Part 2: %d\n", p2);

	return EXIT_SUCCESS;
}

void test(char* filename, int32 expected1, int32 expected2) {
	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1, p2;

	fp = fopen(filename, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	// p2 = part2(rows);

	assert(expected1 == p1);
	// assert(expected2 == p2);
}

int32 part1(char** rows) {
	rule* rules = NULL;
	uint32 valid = 0;
	uint32 i, line;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		char* line = rows[i];
		if (strlen(line) == 0) {
			break;
		}

		rule r = { .pos = 0, .isTerminal = FALSE, .terminal = 0, .nonTerminal = { {-1, -1}, {-1, -1}}, .isStart = FALSE };

		if (sscanf(line, "%d: %d %d | %d %d", &r.pos, &r.nonTerminal[0][0], &r.nonTerminal[0][1], &r.nonTerminal[1][0], &r.nonTerminal[1][1]) == 5 ||
			sscanf(line, "%d: %d %d", &r.pos, &r.nonTerminal[0][0], &r.nonTerminal[0][1]) == 3 ||
			sscanf(line, "%d: %d | %d", &r.pos, &r.nonTerminal[0][0], &r.nonTerminal[1][0]) == 3 ||
			sscanf(line, "%d: %d", &r.pos, &r.nonTerminal[0][0]) == 2) {
			if (r.pos == 0) {
				r.isStart = TRUE;
			}
		}
		else if (sscanf(line, "%d: \"%c\"", &r.pos, &r.terminal) == 2) {
			r.isTerminal = TRUE;
		}
		else {
			assert(FALSE);
		}

		stb_arr_push(rules, r);
	}

	line = i + 1;

	to_normal_form(rules);
	qsort(rules, stb_arr_len(rules), sizeof(rule), stb_intcmp((int)(&((rule*)(0x0))->pos)));

	// for (i = 0; i < stb_arr_len(rules); ++i) {
	// 	rule r = rules[i];
	// 	printf("pos: %3d isTerminal: %1d, terminal: %d, nonTerminal: %d %d %d %d\n", r.pos, r.isTerminal, r.terminal, r.nonTerminal[0][0], r.nonTerminal[0][1], r.nonTerminal[1][0], r.nonTerminal[1][1]);
	// }

	for (i = line; i < stb_arr_len(rows); ++i) {
		valid += CYK(rules, rows[i]);
	}

	return valid;
}

int32 part2(char** rows) {
	return 0;
}

void to_normal_form(rule* grammar) {
	uint32 n = stb_arr_len(grammar);

	int i, j;

	// START: Eliminate the start symbol from right-hand sides
	for (i = n-1; i >= 0; --i) {
		rule r = grammar[i];
		if (r.isStart) {
			r.isStart = FALSE;
			rule newStart = { .pos = n, .nonTerminal = {{r.pos, -1}, {-1, -1}}, .isTerminal = FALSE, .terminal = 0, .isStart = TRUE };
			stb_arr_push(grammar, newStart);
			++n;
			printf("Starting terminal changed from %d to %d\n", r.pos, newStart.pos);
		}
	}

	printf("START\n");

	// TERM: Eliminate rules with nonsolitary terminals
	//  Can assume input has no rules with non solitary terminals
	//  Skipped
	printf("TERM\n");

	// BIN: Eliminate right-hand sides with more than 2 nonterminals
	//  Can assume input does not have more than 2 non terminals on the right-hand side
	//  The test input does though (who cares)
	//  Skipped
	printf("BIN\n");

	// DEL: Eliminate ε-rules
	//  Can assume input has no empty symbol
	//  Skipped
	printf("DEL\n");

	// UNIT: Eliminate unit rules
	for (i = n-1; i >= 0; --i) {
		rule r = grammar[i];
		if (!r.isTerminal) {
			uint32 b = r.nonTerminal[0][0];
			uint32 c = r.nonTerminal[0][1];
			uint32 d = r.nonTerminal[1][0];
			uint32 e = r.nonTerminal[1][1];
			if ((b != -1 && c == -1) || (d != -1 && e == -1)) {
				printf("Detected unit rule %d\n", r.pos);
				for (j = 0; j < n; ++j) {
					rule r2 = grammar[j];
					if (!r2.isStart && r2.pos == b || r2.pos == d) {
						printf("  Changing rule %d\n", r2.pos);
						rule newRule = {
							.pos = r.pos,
							.isStart = r2.isStart,
							.isTerminal = r2.isTerminal,
							.nonTerminal = {{r2.nonTerminal[0][0], r2.nonTerminal[0][1]}, {r2.nonTerminal[1][0], r2.nonTerminal[1][1]}},
							.terminal = r2.terminal };
						// grammar[j].pos = r.pos;
						stb_arr_push(grammar, newRule);
						++n;

					}
				}
				stb_arr_deleten(grammar, i, 1);
				--n;
			}
		}
	}
	printf("UNIT\n");
}

// https://en.m.wikipedia.org/wiki/CYK_algorithm
uint8 CYK(rule* grammar, char* string) {

	uint32 n = strlen(string);
	uint32 r = stb_arr_len(grammar);
	uint8*** P = calloc(n, sizeof *P);

	uint8 q = FALSE;

	int l, s, p, v;

	// printf("%s\n", string);

	if (n == 0) return 0;

	// Init
	for (l = 0; l < n; ++l) {
		P[l] = calloc(n, sizeof *P[l]);
		for (v = 0; v < n; ++v) {
			P[l][v] = calloc(r, sizeof *P[l][v]);
		}
	}

	// Match terminal rules
	for (l = 0; l < n; ++l) {
		for (v = 0; v < r; ++v) {
			rule rule = grammar[v];
			if (rule.isTerminal && rule.terminal == string[l]) {
				// printf("  Matched terminal rule %d: -> '%c'\n", rule.pos, rule.terminal);
				P[0][l][rule.pos] = TRUE;
			}
		}
	}


	// Match non terminal rules
	for (l = 1; l < n; ++l) { // Length of substring considered
		for (s = 0; s < n-l; ++s) {	// Start of substring
			for (p = 0; p < l; ++p) {	// Partition of substring
				for (v = 0; v < r; ++v) {
					rule rule = grammar[v];
					if (!rule.isTerminal) {
						uint32 b = rule.nonTerminal[0][0];
						uint32 c = rule.nonTerminal[0][1];
						uint32 d = rule.nonTerminal[1][0];
						uint32 e = rule.nonTerminal[1][1];

						if (P[p][s][b] && P[l-p-1][s+p+1][c]) {
							// printf("    Matched non terminal rule %d -> %d %d\n", rule.pos, b, c);
							P[l][s][rule.pos] = TRUE;
						}

						if (d != -1 && e != -1) {
							if (P[p][s][d] && P[l-p-1][s+p+1][e]) {
								// printf("    Matched non terminal rule %d -> %d %d\n", rule.pos, d, e);
								P[l][s][rule.pos] = TRUE;
							}
						}
					}
				}
			}
		}
	}

	// for (l = 0; l < n; ++l) {
	// 	printf("P[%d]:   ", l);
	// 	for (s = 0; s < n; ++s) {
	// 		for (v = 0; v < r; ++v) {
	// 			if (P[l][s][v]) {
	// 				// printf("P[%d][%d][%d] = %d", l, s, v, v);
	// 				printf("%d", grammar[v].pos);
	// 			}
	// 			// else {
	// 			// 	printf(" ");
	// 			// }
	// 		}
	// 		printf(" ");
	// 	}
	// 	printf("\n");
	// }


	// printf("Is Valid: %d  ---------------------\n", P[n-1][0][0]);

	return P[n-1][0][0];
}
