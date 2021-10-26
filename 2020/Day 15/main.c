// https://adventofcode.com/2020/day/15
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"
#define testFile2 "test2.txt"
#define testFile3 "test3.txt"
#define testFile4 "test4.txt"
#define testFile5 "test5.txt"
#define testFile6 "test6.txt"
#define testFile7 "test7.txt"

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 436, 175594);
	test(testFile2, 1, 2578);
	test(testFile3, 10, 3544142);
	test(testFile4, 27, 261214);
	test(testFile5, 78, 6895259);
	test(testFile6, 438, 18);
	test(testFile7, 1836, 362);

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

	printf("Part 1: %d\n", p1);	// 755
	printf("Part 2: %d\n", p2);	// 11962

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
	stb_uidict* memory = stb_uidict_create();
	uint32 nturn;
	char** starts = stb_tokens(rows[0], ",", &nturn);
	uint32* turns = NULL;
	uint32 i;

	// Prepend 0 so that turns[1] -> Turn 1
	stb_arr_push(turns, 0);
	for (i = 0; i < nturn; ++i) {
		uint32 n = atoi(starts[i]);
		stb_arr_push(turns, n);
		// printf("%d\n", n);
		if (i > 0) {
			stb_uidict_set(memory, turns[i], i);
		}
	}

	++nturn;
	for (; nturn <= 2020; ++nturn) {
		uint32 last = turns[nturn-1];
		if (stb_uidict_get_flag(memory, last, &i) == FALSE) {
			// Last number was new, say 0
			stb_arr_push(turns, 0);
		}
		else {
			// Last number was repeated, say nturn - i - 1
			stb_arr_push(turns, nturn - i - 1);
		}
		// printf("%d\n", turns[nturn]);
		stb_uidict_set(memory, turns[nturn-1], nturn-1);
	}

	i = turns[2020];
	// stb_arr_free(starts);	// stb_arr_free is broken for char**
	stb_arr_free(turns);
	stb_uidict_destroy(memory);

	return i;
}

// Bruteforce works, I'm happy (~5ish seconds)
int32 part2(char** rows) {
	stb_uidict* memory = stb_uidict_create();
	uint32 nturn;
	char** starts = stb_tokens(rows[0], ",", &nturn);
	uint32* turns = NULL;
	uint32 i;

	// Prepend 0 so that turns[1] -> Turn 1
	stb_arr_push(turns, 0);
	for (i = 0; i < nturn; ++i) {
		uint32 n = atoi(starts[i]);
		stb_arr_push(turns, n);
		if (i > 0) {
			stb_uidict_set(memory, turns[i], i);
		}
	}

	++nturn;
	for (; nturn <= 30000000; ++nturn) {
		uint32 last = turns[nturn-1];
		if (stb_uidict_get_flag(memory, last, &i) == FALSE) {
			// Last number was new, say 0
			stb_arr_push(turns, 0);
		}
		else {
			// Last number was repeated, say nturn - i - 1
			stb_arr_push(turns, nturn - i - 1);
		}
		stb_uidict_set(memory, turns[nturn-1], nturn-1);
	}

	i = turns[30000000];
	// stb_arr_free(starts);	// stb_arr_free is broken for char**
	stb_arr_free(turns);
	stb_uidict_destroy(memory);

	return i;
}
