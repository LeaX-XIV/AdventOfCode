// https://adventofcode.com/2020/day/19
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

typedef struct {
	uint32 nonTerminal[2][2];
	uint32 pos;
	uint8 isTerminal;
	char terminal;
} rule;

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

	printf("Part 1: %d\n", p1);
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

	// assert(expected1 == p1);
	// assert(expected2 == p2);
}

int32 part1(char** rows) {
	rule* rules = NULL;
	uint32 valid = 0;
	uint32 i;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		char* line = rows[i];
		if (strlen(line) == 0) {
			break;
		}

		rule r = { .pos = 0, .isTerminal = FALSE, .terminal = 0, .nonTerminal = { {0, 0}, {0, 0}} };

		if (sscanf(line, "%d: %d %d | %d %d", &r.pos, &r.nonTerminal[0][0], &r.nonTerminal[0][1], &r.nonTerminal[1][0], &r.nonTerminal[1][1]) == 5 ||
			sscanf(line, "%d: %d %d", &r.pos, &r.nonTerminal[0][0], &r.nonTerminal[0][1]) == 3 ||
			sscanf(line, "%d: %d | %d", &r.pos, &r.nonTerminal[0][0], &r.nonTerminal[1][0]) == 3 ||
			sscanf(line, "%d: %d", &r.pos, &r.nonTerminal[0][0]) == 2) {

		}
		else if (sscanf(line, "%d: \"%c\"", &r.pos, &r.terminal) == 2) {
			r.isTerminal = TRUE;
		}
		else {
			assert(FALSE);
		}

		// stb_arr_insert(rules, r.pos, r);
		stb_arr_push(rules, r);
	}

	qsort(rules, stb_arr_len(rules), sizeof(rule), stb_intcmp((int)(&((rule*)(0x0))->pos)));

	// for (i = 0; i < stb_arr_len(rules); ++i) {
	// 	rule r = rules[i];
	// 	printf("pos: %3d isTerminal: %1d, terminal: %d, nonTerminal: %d %d %d %d\n", r.pos, r.isTerminal, r.terminal, r.nonTerminal[0][0], r.nonTerminal[0][1], r.nonTerminal[1][0], r.nonTerminal[1][1]);
	// }

	for (++i; i < stb_arr_len(rows); ++i) {
		valid += CYK(rules, rows[i]);
	}

	return valid;
}

int32 part2(char** rows) {
	return 0;
}

// https://en.m.wikipedia.org/wiki/CYK_algorithm
uint8 CYK(rule* grammar, char* string) {
	uint32 n = strlen(string);
	uint32 r = stb_arr_len(grammar);
	uint8*** P = calloc(n, (sizeof *P));

	uint32 s, v, l, p;

	for (s = 0; s < n; ++s) {
		P[s] = calloc(n, (sizeof *P[s]));
		for (v = 0; v < n; ++v) {
			P[s][v] = calloc(r, (sizeof *P[s][v]));
		}
	}

	for (s = 0; s < n; ++s) {
		for (v = 0; v < r; ++v) {
			rule R = grammar[v];
			if (R.isTerminal && R.terminal == string[s]) {
				P[0][s][v] = TRUE;
			}
		}
	}

	for (l = 1; l < n; ++l) {
		for (s = 0; s < n - l + 1; ++s) {
			for (p = 0; p < l - 1; ++p) {
				for (v = 0; v < r; ++v) {
					rule R = grammar[v];
					if (!R.isTerminal) {
						P[l][s][v] = P[p][s][R.nonTerminal[0][0]] && P[p][s][R.nonTerminal[0][1]];
						// P[l][s][v] = P[p][s][R.nonTerminal[1][0]] && P[p][s][R.nonTerminal[1][1]];
					}
				}
			}
		}
	}


	return P[n-1][0][0];
}
