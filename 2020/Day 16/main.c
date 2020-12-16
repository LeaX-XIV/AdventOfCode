// https://adventofcode.com/2020/day/16
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

typedef struct {
	uint32 min, max;
} range;

typedef struct {
	char desc[20];
	range low, high;
} rule;

int32 findInvalid(rule* rules, char* csvTicket);
uint8 perm(uint32 pos, uint32* sol, uint8* mark, rule* rules, uint32** tickets);

int32 part1(char** rows);
stb_uint64 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 71, 0);

	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1;
	stb_uint64 p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	p2 = part2(rows);

	printf("Part 1: %d\n", p1);	// 19087
	printf("Part 2: %llu\n", p2);	// 1382443095281

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
	uint32 sumInvalid = 0;
	uint32 nemptylines = 0;
	uint32 i;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		char* line = rows[i];
		if (strlen(line) == 0) {
			++nemptylines;
			continue;
		}

		switch (nemptylines) {
		case 0: {
			uint32 minL, maxL, minH, maxH;
			char** r = stb_tokens(line, ":", NULL);
			sscanf(r[1], "%d-%d or %d-%d", &minL, &maxL, &minH, &maxH);
			rule rule = { .desc = "", .low = {.min = minL, .max = maxL}, .high = {.min = minH, .max = maxH} };
			stb_arr_push(rules, rule);
		} break;
		case 1: {
			continue;
		} break;
		case 2: {
			int32 invalid = findInvalid(rules, line);
			if (invalid > 0) {
				sumInvalid += invalid;
			}
		} break;
		}
	}

	return sumInvalid;
}

stb_uint64 part2(char** rows) {
	rule* rules = NULL;
	uint32** tickets = NULL;
	uint32 nemptylines = 0;
	uint32 i;
	stb_uint64 dep = 1;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		char* line = rows[i];
		if (strlen(line) == 0) {
			++nemptylines;
			continue;
		}

		switch (nemptylines) {
		case 0: {
			uint32 minL, maxL, minH, maxH;
			char** r = stb_tokens(line, ":", NULL);
			sscanf(r[1], "%d-%d or %d-%d", &minL, &maxL, &minH, &maxH);
			rule rule = { .desc = "", .low = {.min = minL, .max = maxL}, .high = {.min = minH, .max = maxH} };
			strcpy(rule.desc, r[0]);
			stb_arr_push(rules, rule);
		} break;
		case 1:
		case 2: {
			if (findInvalid(rules, line) >= 0) {
				continue;
			}

			uint32* fields = NULL;
			uint32 i, n;
			char** values = stb_tokens(line, ",", &n);
			if (n == 1) {
				continue;
			}
			for (i = 0; i < n; ++i) {
				stb_arr_push(fields, atoi(values[i]));
			}
			stb_arr_push(tickets, fields);
		} break;
		}
	}

	uint32* sol = malloc(stb_arr_len(rules) * (sizeof *sol));
	uint8* mark = calloc(stb_arr_len(rules), (sizeof *mark));
	perm(0, sol, mark, rules, tickets);

	for (i = 0; i < stb_arr_len(rules); ++i) {
		if (sol[i] <= 5) {
			// Departure
			dep *= tickets[0][i];
		}
	}

	return dep;
}

int32 findInvalid(rule* rules, char* csvTicket) {
	int32 invalid = -1;
	uint32 n;
	uint32 i, j;
	uint32 ok;

	char** values = stb_tokens(csvTicket, ",", &n);
	if (n == 1) {
		// First line: "nearby tickets:"
		n = 0;
		invalid = 0;
	}
	for (i = 0; i < n; ++i) {
		ok = FALSE;
		uint32 v = atoi(values[i]);

		for (j = 0; j < stb_arr_len(rules); ++j) {
			if ((v >= rules[j].low.min && v <= rules[j].low.max) || (v >= rules[j].high.min && v <= rules[j].high.max)) {
				ok = TRUE;
				break;
			}
		}

		if (ok == FALSE) {
			invalid = v;
			break;
		}
	}

	return invalid;
}

uint8 perm(uint32 pos, uint32* sol, uint8* mark, rule* rules, uint32** tickets) {
	uint32 i, j;
	uint32 n = stb_arr_len(rules);

	if (pos >= n) {
		// Check for validity
		// uint32 j;

		// for (j = 0; j < stb_arr_len(tickets); ++j) {
		// 	for (i = 0; i < stb_arr_len(rules); ++i) {
		// 		uint32 v = tickets[j][i];
		// 		if ((v < rules[j].low.min || v > rules[j].low.max) && (v < rules[j].high.min || v > rules[j].high.max)) {
		// 			return FALSE;
		// 		}
		// 	}
		// }

		return TRUE;
	}

	for (i = 0; i < n; ++i) {
		if (mark[i] == 0) {
			uint8 ok = TRUE;
			mark[i] = 1;
			sol[pos] = i;

			for (j = 0; j < stb_arr_len(tickets); ++j) {
				uint32 v = tickets[j][pos];
				if ((v < rules[i].low.min || v > rules[i].low.max) && (v < rules[i].high.min || v > rules[i].high.max)) {
					ok = FALSE;
					break;
				}
			}
			if (ok == TRUE) {
				if (perm(pos+1, sol, mark, rules, tickets) == TRUE) {
					return TRUE;
				}
			}
			mark[i] = 0;
		}
	}
	return FALSE;
}