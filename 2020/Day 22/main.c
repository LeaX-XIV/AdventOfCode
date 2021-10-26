// https://adventofcode.com/2020/day/22
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

stb_uint64 computeScore(uint32* playerHand);
uint32 playRecursive(uint32** p1, uint32** p2);
int32 findPast(char* v, char** arr);
char* toString(uint32* arr);

stb_uint64 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 306, 291);

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

	printf("Part 1: %lld\n", p1);	// 35005
	printf("Part 2: %lld\n", p2);	// 32751

	return EXIT_SUCCESS;
}

void test(char* filename, int32 expected1, int32 expected2) {
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
	uint32* p1 = NULL;
	uint32* p2 = NULL;
	uint32** p;
	uint32 i;

	for (i = 1, p = &p1; i < stb_arr_len(rows); ++i) {
		if (strlen(rows[i]) == 0) {
			p = &p2;
			++i;
			continue;
		}

		stb_arr_push(*p, atoi(rows[i]));
	}

	while (stb_arr_len(p1) > 0 && stb_arr_len(p2) > 0) {
		uint32 c1, c2;

		c1 = p1[0];
		c2 = p2[0];

		stb_arr_delete(p1, 0);
		stb_arr_delete(p2, 0);

		assert(c1 != c2);

		if (c1 > c2) {
			stb_arr_push(p1, c1);
			stb_arr_push(p1, c2);
		}
		else {
			stb_arr_push(p2, c2);
			stb_arr_push(p2, c1);
		}
	}

	return max(computeScore(p1), computeScore(p2));
}

int32 part2(char** rows) {
	uint32* p1 = NULL;
	uint32* p2 = NULL;
	uint32** p;
	uint32 i;
	uint32 winner;

	for (i = 1, p = &p1; i < stb_arr_len(rows); ++i) {
		if (strlen(rows[i]) == 0) {
			p = &p2;
			++i;
			continue;
		}

		stb_arr_push(*p, atoi(rows[i]));
	}

	winner = playRecursive(&p1, &p2);

	return max(computeScore(p1), computeScore(p2));
}

stb_uint64 computeScore(uint32* playerHand) {
	stb_uint64 sum = 0;
	uint32 i;
	uint32 len = stb_arr_len(playerHand);

	for (i = 0; i < len; ++i) {
		sum += playerHand[i] * (len - i);
	}

	return sum;
}

uint32 playRecursive(uint32** p1, uint32** p2) {
	uint32 winner = 0;
	char** pastp1 = NULL;
	char** pastp2 = NULL;

	while (stb_arr_len(*p1) > 0 && stb_arr_len(*p2) > 0) {
		uint32 c1, c2;
		int32 i;
		winner = 0;

		if ((i = findPast(toString(*p1), pastp1)) >= 0 && i == findPast(toString(*p2), pastp2)) {
			winner = 1;
			break;
		}
		else {
			stb_arr_push(pastp1, toString(*p1));
			stb_arr_push(pastp2, toString(*p2));
		}

		c1 = (*p1)[0];
		c2 = (*p2)[0];

		stb_arr_delete(*p1, 0);
		stb_arr_delete(*p2, 0);

		assert(c1 != c2);

		if (c1 <= stb_arr_len(*p1) && c2 <= stb_arr_len(*p2)) {
			uint32* newp1 = NULL;
			uint32* newp2 = NULL;
			uint i;

			for (i = 0; i < c1; ++i) { stb_arr_push(newp1, (*p1)[i]); }
			for (i = 0; i < c2; ++i) { stb_arr_push(newp2, (*p2)[i]); }

			winner = playRecursive(&newp1, &newp2);
		}
		else {
			winner = c1 > c2 ? 1 : 2;
		}

		assert(winner == 1 || winner == 2);

		if (winner == 1) {
			stb_arr_push(*p1, c1);
			stb_arr_push(*p1, c2);
		}
		else {
			stb_arr_push(*p2, c2);
			stb_arr_push(*p2, c1);
		}
	}

	return winner;
}

char* toString(uint32* arr) {
	uint32 i;
	uint32 all = 100;
	char* r = calloc(all, (sizeof* r));

	for (i = 0; i < stb_arr_len(arr); ++i) {
		if (strlen(r) + floor(log10(abs(arr[i]))) + 1 >= all) {
			all *= 2;
			char* t = realloc(r, all);
			if (t != NULL) {
				r = t;
			}
		}

		if (i == 0) {
			sprintf(r, "%d", arr[i]);
		}
		else {
			sprintf(r + strlen(r), "-%d", arr[i]);
		}
	}

	return r;
}

int32 findPast(char* v, char** arr) {
	int32 r = -1;
	uint32 i;

	for (i = 0; i < stb_arr_len(arr); ++i) {
		if (0 == strcmp(v, arr[i])) {
			r = i;
			break;
		}
	}

	return r;
}
