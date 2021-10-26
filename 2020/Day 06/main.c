// https://adventofcode.com/2020/day/6
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 11, 6);

	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	stb_arr_push(rows, "");
	p1 = part1(rows);
	p2 = part2(rows);

	printf("Part 1: %d\n", p1);	// 6590
	printf("Part 2: %d\n", p2);	// 3288

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
	stb_arr_push(rows, "");
	p1 = part1(rows);
	p2 = part2(rows);

	assert(expected1 == p1);
	assert(expected2 == p2);
}

int32 part1(char** rows) {
	uint32 sum = 0;
	uint32 count = 0;
	stb_sdict* answers = stb_sdict_new(0);
	char c[2] = { 0, 0 };
	char** person;

	stb_arr_for(person, rows) {
		uint8 l = strlen(*person);
		uint8 i;
		for (i = 0; i < l; ++i) {
			c[0] = (*person)[i];
			assert(islower(c[0]) != 0);
			stb_sdict_add(answers, c, c);
		}

		if (l == 0) {
			// Blank line, next group coming up
			count = stb_sdict_count(answers);
			sum += count;
			stb_sdict_delete(answers);
			answers = stb_sdict_new(0);
		}
	}

	return sum;
}

int32 part2(char** rows) {
	uint32 sum = 0;
	uint32 n_people = 0;
	uint32* answers = calloc('z' - 'a' + 1, (sizeof *answers));
	char** person;

	stb_arr_for(person, rows) {
		uint8 l = strlen(*person);
		uint8 i;
		uchar c;

		++n_people;
		for (i = 0; i < l; ++i) {
			c = (*person)[i];
			assert(islower(c) != 0);
			answers[c - 'a'] += 1;
		}

		if (l == 0) {
			// Blank line, next group coming up
			uint32 count = 0;
			uint8 i;
			--n_people;
			for (i = 0; i < 'z' - 'a' + 1; ++i) {
				if (answers[i] == n_people) {
					++count;
				}
				answers[i] = 0;
			}

			sum += count;
			n_people = 0;
		}
	}

	free(answers);
	return sum;
}
