// https://adventofcode.com/2020/day/21
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 5, 0);

	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	// p2 = part2(rows);

	printf("Part 1: %d\n", p1);
	// printf("Part 2: %d\n", p2);

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
	char** parts;
	char** ingredients;
	char** allergens;
	uint32 nParts, nIngredients, nAllergens;
	uint32 i, j;

	for (i = 0; i < stb_arr_len(rows); ++i) {

		// parts = stb_tokens(rows[i], " (contains ", &nParts);
		// Splits on the set of characters in delimit, not the string
		// Use stb_stristr and strichr to search and stb_strncpy to copy

		assert(nParts == 2);

		ingredients = stb_tokens(parts[0], " ", &nIngredients);
		allergens = stb_tokens(parts[1], ", ", &nAllergens);
		// Delete final ')'
		allergens[nAllergens-1][strlen(allergens[nAllergens-1])-1] = '\0';



	}

}

int32 part2(char** rows) {
	return 0;
}
