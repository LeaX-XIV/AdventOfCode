// https://adventofcode.com/2020/day/7
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

uint32 contains(char** rows, char* color);

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 4, 32);

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

	printf("Part 1: %d\n", p1);	// 254
	printf("Part 2: %d\n", p2); // 6006

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
	char* regex_start = "^.+";
	uint32* container = calloc(stb_arr_len(rows), (sizeof *container));
	uint32 sum = 0;
	uint32 i;
	char** tosearch = NULL;

	stb_arr_push(tosearch, "shiny gold");
	while (stb_arr_len(tosearch) > 0) {
		char* parent = tosearch[0];
		stb_arr_delete(tosearch, 0);

		stb_matcher* matcher;
		char* regex = malloc(strlen(regex_start) + strlen(parent) + 1);

		strcpy(regex, regex_start);
		strcat(regex, parent);

		matcher = stb_regex_matcher(regex);

		for (i = 0; i < stb_arr_len(rows); ++i) {
			char* line = rows[i];
			if (stb_matcher_find(matcher, line) > 0) {
				char* end_parent = stb_stristr(line, " bags");
				char* newparent = stb_substr(line, end_parent - line);

				if (container[i] == 0) {
					stb_arr_push(tosearch, newparent);
					container[i] = 1;
				}
			}
		}
	}

	for (i = 0; i < stb_arr_len(rows); ++i) {
		sum += container[i];
	}

	free(container);
	return sum;
}

int32 part2(char** rows) {
	return contains(rows, "shiny gold");
}

uint32 contains(char** rows, char* color) {
	uint32 i;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		char* line = rows[i];
		if (0 != strncmp(color, line, strlen(color))) {
			continue;
		}

		uint32 inside = 0;
		uint32 displacement = 0;
		while (displacement < strlen(line)) {
			if (displacement == 0) {
				displacement = strlen(color) + strlen(" bags contain ");
			}

			uint32 n = atoi(line + displacement);
			displacement += 2;
			char* end_color = stb_stristr(line + displacement, " bag");
			char* newcolor = stb_substr(line + displacement, end_color - line - displacement);

			if (n == 0) { break; }

			displacement += strlen(newcolor) + strlen(" bag, ");
			displacement += n > 1 ? 1 : 0;

			inside += n + n * contains(rows, newcolor);
		}

		return inside;
	}
}