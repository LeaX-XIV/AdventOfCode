// https://adventofcode.com/2020/day/2
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "./input.txt"
#define testFile1 "./test1.txt"

int32 part1(char** rows, uint32 n_rows);
int32 part2(char** rows, uint32 n_rows);
void test(char* filename, int32 expected1, int32 expected2);

int main(void) {

	test(testFile1, 2, 1);

	FILE* fp;
	uint32 n_lines;
	char** rows = NULL;
	char* row;
	int32 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows, n_lines);
	p2 = part2(rows, n_lines);

	printf("Part 1: %d\n", p1);	// 548
	printf("Part 2: %d\n", p2);	// 502

	return EXIT_SUCCESS;
}

void test(char* filename, int32 expected1, int32 expected2) {
	FILE* fp;
	uint32 n_lines;
	char** rows = NULL;
	char* row;
	int32 p1, p2;

	fp = fopen(filename, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows, n_lines);
	p2 = part2(rows, n_lines);

	assert(expected1 == p1);
	assert(expected2 == p2);
}

int32 part1(char** rows, uint32 n_rows) {
	uint32 correct = 0;
	char** line;

	stb_arr_for(line, rows) {
		uint32 min, max;
		char letter;
		uint32 count = 0;
		char* password = malloc(30 * (sizeof *password));
		uint32 i;

		sscanf(*line, "%u-%u %c: %20s", &min, &max, &letter, password);

		for (i = 0; i < strlen(password); ++i) {
			char c = password[i];

			if (c == letter) {
				++count;
			}
		}

		if (count >= min && count <= max) {
			++correct;
		}

		free(password);
	}

	return correct;
}

int32 part2(char** rows, uint32 n_rows) {
	uint32 correct = 0;
	char** line;

	stb_arr_for(line, rows) {
		uint32 a, b;
		char letter;
		uint32 count = 0;
		char* password = malloc(30 * (sizeof *password));
		uint32 i;

		sscanf(*line, "%u-%u %c: %20s", &a, &b, &letter, password);

		if ((password[a-1] == letter && password[b-1] != letter) || (password[a-1] != letter && password[b-1] == letter)) {
			++correct;
		}

		free(password);
	}

	return correct;
}