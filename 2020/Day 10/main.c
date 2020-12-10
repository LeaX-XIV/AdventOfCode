// https://adventofcode.com/2020/day/10
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"
#define testFile2 "test2.txt"

stb_uint64 get_nroutes(uint32** dag, stb_uint64* memo, uint32 src, uint32 dst);

int32 part1(uint32* rows);
stb_uint64 part2(uint32* rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 35, 8);
	test(testFile2, 220, 19208);

	FILE* fp;
	uint32* rows = NULL;
	char* row;
	int32 p1;
	stb_uint64 p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, atoi(row));
	}
	p1 = part1(rows);
	p2 = part2(rows);

	printf("Part 1: %d\n", p1);	// 2484
	printf("Part 2: %lld\n", p2);	// 15790581481472

	return EXIT_SUCCESS;
}

void test(char* filename, int32 expected1, int32 expected2) {
	FILE* fp;
	uint32* rows = NULL;
	char* row;
	int32 p1;
	stb_uint64 p2;

	fp = fopen(filename, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, atoi(row));
	}
	p1 = part1(rows);
	p2 = part2(rows);

	assert(expected1 == p1);
	assert(expected2 == p2);
}

int32 part1(uint32* rows) {
	uint32* sorted = stb_arr_copy(rows);
	uint32 baseRating = 0;
	uint32 jolts1 = 0;
	uint32 jolts3 = 1;

	qsort(sorted, stb_arr_len(sorted), (sizeof *sorted), stb_intcmp(0));
	while (stb_arr_len(sorted)) {
		uint32 adptRating = sorted[0];
		stb_arr_delete(sorted, 0);

		uint32 diffRating = adptRating - baseRating;

		assert(diffRating >= 1 && diffRating < 4);

		baseRating = adptRating;

		if (diffRating == 1) {
			++jolts1;
		}

		if (diffRating == 3) {
			++jolts3;
		}
	}

	// free(sorted);
	return jolts1 * jolts3;
}

stb_uint64 part2(uint32* rows) {
	stb_arr_push(rows, 0);
	uint32* sorted = stb_arr_copy(rows);
	qsort(sorted, stb_arr_len(sorted), (sizeof *sorted), stb_intcmp(0));
	stb_arr_push(sorted, sorted[stb_arr_len(sorted)-1] + 3);
	uint32** dag = malloc(stb_arr_len(sorted) * (sizeof *dag));
	stb_uint64* memo = calloc(stb_arr_len(sorted), (sizeof *memo));
	uint32 i;

	for (i = 0; i < stb_arr_len(sorted); ++i) {
		uint32 j;

		dag[i] = NULL;
		for (j = i + 1; j < stb_arr_len(sorted); ++j) {
			if (sorted[j] - sorted[i] < 4) {
				stb_arr_push(dag[i], j);
			}
		}
	}

	get_nroutes(dag, memo, 0, stb_arr_len(sorted) - 1);

	return memo[0];
}

stb_uint64 get_nroutes(uint32** dag, stb_uint64* memo, uint32 src, uint32 dst) {
	if (src == dst) {
		return 1;
	}
	uint32* adj;

	stb_arr_for(adj, dag[src]) {
		if (memo[src] == 0) {
			memo[src] += get_nroutes(dag, memo, *adj, dst);
		}
		else {
			memo[src] += memo[*adj];
		}
	}

	return memo[src];
}
