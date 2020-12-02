// https://adventofcode.com/2020/day/1
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"
#define testFile2 "test2.txt"
#define testFile3 "test3.txt"

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 514579, 241861950);

	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	p2 = part2(rows);

	printf("Part 1: %d\n", p1);	// 713184
	printf("Part 2: %d\n", p2);	// 261244452

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
	p2 = part2(rows);

	assert(expected1 == p1);
	assert(expected2 == p2);
}

int32 part1(char** rows) {
	uint i, j;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		for (j = i + 1; j < stb_arr_len(rows); ++j) {
			int a, b;

			a = atoi(rows[i]);
			b = atoi(rows[j]);

			if (a + b == 2020) {
				int c = a * b;
				return c;
			}
		}
	}

	assert(FALSE);
}

int32 part2(char** rows) {
	uint i, j, k;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		for (j = i + 1; j < stb_arr_len(rows); ++j) {
			for (k = j + 1; k < stb_arr_len(rows); ++k) {
				int a, b, c;

				a = atoi(rows[i]);
				b = atoi(rows[j]);
				c = atoi(rows[k]);

				if (a + b + c == 2020) {
					return a * b * c;
				}
			}
		}
	}

	assert(FALSE);
}