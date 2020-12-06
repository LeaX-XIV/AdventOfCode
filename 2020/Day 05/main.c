// https://adventofcode.com/2020/day/5
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

#define FRONT 'F'
#define BACK 'B'
#define LEFT 'L'
#define RIGHT 'R'

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 820, 0);

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

	printf("Part 1: %d\n", p1);	// 944
	printf("Part 2: %d\n", p2);	// 554

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
	char** line;
	uint32 max = 0;

	stb_arr_for(line, rows) {
		char* ticket = *line;
		uint32 id;
		uint8 row = 0;
		uint8 column = 0;
		uint32 i;

		for (i = 0; i < 7; ++i) {
			uint8 next = ticket[i] == BACK;

			row = (row << 1) + next;
		}

		for (; i < strlen(ticket); ++i) {
			uint8 next = ticket[i] == RIGHT;

			column = (column << 1) + next;
		}

		id = row * 8 + column;

		max = stb_max(max, id);
	}

	return max;
}

int32 part2(char** rows) {
	char** line;
	uint32* seats = NULL;
	uint32* s;
	uint32 myseat;

	for (myseat = 0; myseat < 1024; ++myseat) {
		stb_arr_push(seats, 0);
	}


	stb_arr_for(line, rows) {
		char* ticket = *line;
		uint32 id;
		uint8 row = 0;
		uint8 column = 0;
		uint32 i;

		for (i = 0; i < 7; ++i) {
			uint8 next = ticket[i] == BACK;

			row = (row << 1) + next;
		}

		for (; i < strlen(ticket); ++i) {
			uint8 next = ticket[i] == RIGHT;

			column = (column << 1) + next;
		}

		id = row * 8 + column;

		seats[id] = id;
	}

	myseat = 0;
	stb_arr_for(s, seats) {
		if (*s == 0) continue;
		if (myseat != 0) break;

		if (*(s+1) == 0 && *(s+2) != 0) {
			myseat = (*s) + 1;
		}
	}

	return myseat;
}