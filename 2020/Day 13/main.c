// https://adventofcode.com/2020/day/13
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

typedef struct {
	uint32 a, b;
} pair;

int32 part1(char** rows);
stb_uint64 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 295, 1068781);

	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1;
	stb_uint64 p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	p2 = part2(rows);

	printf("Part 1: %d\n", p1);	// 203
	printf("Part 2: %lld\n", p2);	// 905694340256752

	return EXIT_SUCCESS;
}

void test(char* filename, int32 expected1, int32 expected2) {
	FILE* fp;
	char** rows = NULL;
	char* row;
	int32 p1;
	stb_uint64 p2;

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
	uint32 arriveMinutes = atoi(rows[0]);
	uint32 minBusArrival = ~0;
	uint32 minId = 0;
	uint32 n;
	char** list = stb_tokens(rows[1], ",", &n);
	uint32* ids = NULL;
	uint32* id;
	uint32 i;

	for (i = 0; i < n; ++i) {
		if (list[i][0] == 'x') {
			continue;
		}

		stb_arr_push(ids, atoi(list[i]));
	}

	stb_arr_for(id, ids) {
		uint32 busArrival = *id * (1 + arriveMinutes / *id);

		if (busArrival < minBusArrival) {
			minBusArrival = busArrival;
			minId = *id;
		}
	}

	return (minBusArrival - arriveMinutes) * minId;
}

stb_uint64 part2(char** rows) {
	uint32 n;
	char** list = stb_tokens(rows[1], ",", &n);
	pair* pairs = NULL;
	uint32 i;
	stb_uint64 j;
	stb_uint64 partialProduct;


	for (i = 0; i < n; ++i) {
		if (list[i][0] == 'x') {
			continue;
		}
		pair p = { .a = atoi(list[i]), .b = i };

		stb_arr_push(pairs, p);
	}

	partialProduct = 1;
	for (i = 0, j = 0; i < stb_arr_len(pairs); ++i) {
		for (; (j + pairs[i].b) % pairs[i].a; j += partialProduct);
		partialProduct *= pairs[i].a;
	}

	return j;
}
