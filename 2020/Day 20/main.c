// https://adventofcode.com/2020/day/20
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

typedef struct {
	uint32 id;
	char normalizedSize[11];
} normalSide;

normalSide* getNorthNormalSide(uint32 id, char** tile);
normalSide* getSouthNormalSide(uint32 id, char** tile);
normalSide* getEastNormalSide(uint32 id, char** tile);
normalSide* getWestNormalSide(uint32 id, char** tile);

stb_uint64 part1(char** rows);
stb_uint64 part2(char** rows);
void test(char* filename, stb_uint64 expected, stb_uint64 expected2);

int main(void) {

	test(testFile1, 20899048083289, 273);
	printf("Passed\n");

	FILE* fp;
	char** rows = NULL;
	char* row;
	stb_uint64 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	p2 = part2(rows);

	printf("Part 1: %lld\n", p1);	// 4006801655873
	printf("Part 2: %lld\n", p2);

	return EXIT_SUCCESS;
}

void test(char* filename, stb_uint64 expected1, stb_uint64 expected2) {
	FILE* fp;
	char** rows = NULL;
	char* row;
	stb_uint64 p1, p2;

	fp = fopen(filename, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	p2 = part2(rows);

	assert(expected1 == p1);
	assert(expected2 == p2);
}

stb_uint64 part1(char** rows) {
	normalSide* notMatched = NULL;
	stb_uint64 runningProduct = 1;
	int32 i, j;
	uint32 flip;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		if (strlen(rows[i]) == 0) {
			continue;
		}

		uint32 id;
		char** tile = NULL;
		sscanf(rows[i], "Tile %d", &id);
		for (j = 0, ++i; j < 10; ++j, ++i) {
			stb_arr_push(tile, rows[i]);
		}

		normalSide* N = getNorthNormalSide(id, tile);
		normalSide* S = getSouthNormalSide(id, tile);
		normalSide* E = getEastNormalSide(id, tile);
		normalSide* W = getWestNormalSide(id, tile);

		uint8 matchedN = FALSE;
		uint8 matchedS = FALSE;
		uint8 matchedE = FALSE;
		uint8 matchedW = FALSE;

		for (flip = 0; flip <= 1; ++flip) {

			for (j = stb_arr_len(notMatched) - 1; j >= 0; --j) {
				char* n = notMatched[j].normalizedSize;
				if (flip > 0) {
					stb_reverse(n, strlen(n), (sizeof *n));
				}

				if (!matchedN) {
					if (0 == strcmp(N->normalizedSize, n)) {
						// Match
						matchedN = TRUE;
						stb_arr_delete(notMatched, j);
						continue;
					}
				}
				if (!matchedS) {
					if (0 == strcmp(S->normalizedSize, n)) {
						// Match
						matchedS = TRUE;
						stb_arr_delete(notMatched, j);
						continue;
					}
				}
				if (!matchedE) {
					if (0 == strcmp(E->normalizedSize, n)) {
						// Match
						matchedE = TRUE;
						stb_arr_delete(notMatched, j);
						continue;
					}
				}
				if (!matchedW) {
					if (0 == strcmp(W->normalizedSize, n)) {
						// Match
						matchedW = TRUE;
						stb_arr_delete(notMatched, j);
						continue;
					}
				}
			}
		}

		if (!matchedN) {
			stb_arr_push(notMatched, *N);
		}
		if (!matchedS) {
			stb_arr_push(notMatched, *S);
		}
		if (!matchedE) {
			stb_arr_push(notMatched, *E);
		}
		if (!matchedW) {
			stb_arr_push(notMatched, *W);
		}
	}

	j = 0;
	for (i = 0; i < stb_arr_len(notMatched); ++i) {
		if (j == 0) {
			j = notMatched[i].id;
		}
		else {
			if (j == notMatched[i].id) {
				runningProduct *= j;
			}
			j = notMatched[i].id;
		}
	}

	return runningProduct;
}

stb_uint64 part2(char** rows) {
	return 0;
}

normalSide* getNorthNormalSide(uint32 id, char** tile) {
	// Left to right
	normalSide* n = malloc(1 * (sizeof *n));
	n->id = id;
	strncpy(n->normalizedSize, tile[0], 10);

	return n;
}

normalSide* getSouthNormalSide(uint32 id, char** tile) {
	// Right to left
	normalSide* n = malloc(1 * (sizeof *n));
	uint8 i;

	n->id = id;
	for (i = 0; i < 10; ++i) {
		n->normalizedSize[i] = tile[9][10-i-1];
	}
	n->normalizedSize[10] = 0;

	return n;
}

normalSide* getEastNormalSide(uint32 id, char** tile) {
	// Top to bottom
	normalSide* n = malloc(1 * (sizeof *n));
	uint8 i;

	n->id = id;
	for (i = 0; i < 10; ++i) {
		n->normalizedSize[i] = tile[i][9];
	}
	n->normalizedSize[10] = 0;

	return n;
}

normalSide* getWestNormalSide(uint32 id, char** tile) {
	// Bottom to top
	normalSide* n = malloc(1 * (sizeof *n));
	uint8 i;

	n->id = id;
	for (i = 0; i < 10; ++i) {
		n->normalizedSize[i] = tile[10-i-1][0];
	}
	n->normalizedSize[10] = 0;

	return n;
}
