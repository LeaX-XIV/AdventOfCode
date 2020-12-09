// https://adventofcode.com/2020/day/9
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

#define PREAMBLE_LENGTH 25
#define WINDOW_SIZE 25

stb_uint64 part1(char** rows, uint32 preamble, uint32 window);
stb_uint64 part2(char** rows, uint32 preamble, uint32 window);
void test(char* filename, stb_uint64 expected, stb_uint64 expected2);

int main(void) {

	test(testFile1, 127, 62);

	FILE* fp;
	char** rows = NULL;
	char* row;
	stb_uint64 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows, PREAMBLE_LENGTH, WINDOW_SIZE);
	p2 = part2(rows, PREAMBLE_LENGTH, WINDOW_SIZE);

	printf("Part 1: %lld\n", p1);	// 20874512
	printf("Part 2: %lld\n", p2);	// 3012420

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
	p1 = part1(rows, 5, 5);
	p2 = part2(rows, 5, 5);

	assert(expected1 == p1);
	assert(expected2 == p2);
}

stb_uint64 part1(char** rows, uint32 preamble, uint32 window) {
	assert(preamble >= window);
	char** line;
	uint32 i, j, k;

	for (i = preamble; i < stb_arr_len(rows); ++i) {
		stb_uint64 a, b, c;
		uint ok = FALSE;
		a = atoll(rows[i]);

		for (j = i - window; j < i && !ok; ++j) {
			b = atoll(rows[j]);

			for (k = j + 1; k < i && !ok; ++k) {
				c = atoll(rows[k]);

				if (b == c) {
					continue;
				}

				ok |= a == b + c;
			}
		}

		if (!ok) {
			break;
		}
	}

	return atoll(rows[i]);
}

stb_uint64 part2(char** rows, uint32 preamble, uint32 window) {
	stb_uint64 invalid = part1(rows, preamble, window);
	uint32 i, j;
	uint8 ok = FALSE;
	stb_uint64 min = ~0x0;
	stb_uint64 max = 0;

	for (i = 0; i < stb_arr_len(rows) - 1 && !ok; ++i) {

		stb_uint64 sum = atoll(rows[i]);

		for (j = i + 1; j < stb_arr_len(rows) && !ok; ++j) {
			sum += atoll(rows[j]);

			if (sum > invalid) {
				break;
			}

			if (sum == invalid) {
				ok = TRUE;
			}

		}
	}

	if (ok) {
		for (--i; i < j; ++i) {
			stb_uint64 a = atoll(rows[i]);
			min = stb_min(min, a);
			max = stb_max(max, a);
		}
	}

	return min + max;
}
