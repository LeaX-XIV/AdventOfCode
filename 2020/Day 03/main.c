// https://adventofcode.com/2020/day/3
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

#define TILE_TREE '#'
#define TILE_EMPTY '.'

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 7, 336);

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

	printf("Part 1: %d\n", p1);	// 250
	printf("Part 2: %d\n", p2);	// 1592662500

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
	uint32 posX, posY;
	uint32 countTrees = 0;
	uint32 slopeX = 3, slopeY = 1;

	for (posX = 0, posY = 0; posY < stb_arr_len(rows); posX += slopeX, posY += slopeY) {
		char tileCurr = rows[posY][posX % strlen(rows[posY])];

		if (tileCurr == TILE_TREE) {
			++countTrees;
		}
	}

	return countTrees;
}

int32 part2(char** rows) {
	uint32 posX, posY;
	uint32 solution = 1;
	uint32 slopeXs[] = { 1, 3, 5, 7, 1 };
	uint32 slopeYs[] = { 1, 1, 1, 1, 2 };
	uint32 i;

	for (i = 0; i < 5; ++i) {
		uint32 slopeX = slopeXs[i];
		uint32 slopeY = slopeYs[i];
		uint32 countTrees = 0;

		for (posX = 0, posY = 0; posY < stb_arr_len(rows); posX += slopeX, posY += slopeY) {
			char tileCurr = rows[posY][posX % strlen(rows[posY])];

			if (tileCurr == TILE_TREE) {
				++countTrees;
			}
		}

		solution *= countTrees;
	}

	return solution;
}