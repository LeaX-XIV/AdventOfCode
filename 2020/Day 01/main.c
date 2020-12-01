// https://adventofcode.com/2020/day/1
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"
#define testFile2 "test2.txt"
#define testFile3 "test3.txt"

int32 part1(char** rows, uint32 n);
int32 part2(char** rows, uint32 n);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 514579, 241861950);

	uint32 n_lines;
	char** rows = NULL;
	int32 p1, p2;

	rows = stb_stringfile_trimmed(inputFile, &n_lines, '\0');
	p1 = part1(rows, n_lines);
	p2 = part2(rows, n_lines);

	printf("Part 1: %d\n", p1);	// 713184
	printf("Part 2: %d\n", p2);	// 261244452

	return EXIT_SUCCESS;
}

void test(char* filename, int32 expected1, int32 expected2) {
	uint32 n_lines;
	char** rows = NULL;
	int32 p1, p2;

	rows = stb_stringfile_trimmed(filename, &n_lines, '\0');
	p1 = part1(rows, n_lines);
	p2 = part2(rows, n_lines);

	assert(expected1 == part1(rows, n_lines));
	assert(expected2 == part2(rows, n_lines));
}

int32 part1(char** rows, uint32 n) {
	uint i, j;

	for (i = 0; i < n; ++i) {
		for (j = i + 1; j < n; ++j) {
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

int32 part2(char** rows, uint32 n) {
	uint i, j, k;

	for (i = 0; i < n; ++i) {
		for (j = i + 1; j < n; ++j) {
			for (k = j + 1; k < n; ++k) {
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