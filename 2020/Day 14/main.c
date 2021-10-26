// https://adventofcode.com/2020/day/14
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

stb_uint64* listFloating(stb_uint64 index, stb_uint64 floatMask);
void computeAddresses(stb_uint64** solutions, stb_uint64 index, stb_uint64 fltMask, int i);

stb_uint64 part1(char** rows);
stb_uint64 part2(char** rows);
void test(char* filename, stb_uint64 expected, stb_uint64 expected2);

int main(void) {

	// Test from part 2
	test(testFile1, 51, 208);

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

	printf("Part 1: %llu\n", p1);	// 16003257187056
	printf("Part 2: %llu\n", p2);	// 3219837697833

	return EXIT_SUCCESS;
}

void test(char* filename, stb_uint64 expected1, stb_uint64 expected2) {
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
	stb_sdict* memory = stb_sdict_new(1);
	stb_uint64 setMask = 0;
	stb_uint64 clrMask = 0;
	stb_uint64 sum = 0;

	char** line;
	int ivar;
	char* kvar;
	void* vvar;

	stb_arr_for(line, rows) {
		switch ((*line)[1]) {
		case 'a': {	// mask
			char* mask = *line + 7;
			uint32 i;

			setMask = 0;
			clrMask = 0;
			for (i = 0; i < strlen(mask); ++i) {
				char cur = mask[i];

				assert(cur == '0' || cur == '1' || cur == 'X');

				switch (cur) {
				case '0': {
					setMask = setMask << 1;
					clrMask = (clrMask << 1) + 1;
				} break;
				case '1': {
					setMask = (setMask << 1) + 1;
					clrMask = clrMask << 1;
				} break;
				default: {
					setMask = setMask << 1;
					clrMask = clrMask << 1;
				}
				}
			}

			clrMask = ~clrMask;
		} break;
		case 'e': {	//mem
			stb_uint64 index, v;
			char* vstr = malloc(12 * (sizeof vstr));
			char* istr = malloc(12 * (sizeof istr));

			sscanf(*line, "mem[%llu] = %llu", &index, &v);
			v |= setMask;
			v &= clrMask;

			sprintf(istr, "%llu", index);
			sprintf(vstr, "%llu", v);

			stb_sdict_set(memory, istr, vstr);
		}break;
		}
	}

	stb_sdict_for(memory, ivar, kvar, vvar) {
		stb_uint64 v = atoll((char*)vvar);
		sum += v;
	}

	return sum;
}

stb_uint64 part2(char** rows) {
	stb_sdict* memory = stb_sdict_new(1);
	stb_uint64 setMask = 0;
	stb_uint64 fltMask = 0;
	stb_uint64 sum = 0;

	char** line;
	int ivar;
	char* kvar;
	void* vvar;

	stb_arr_for(line, rows) {
		switch ((*line)[1]) {
		case 'a': {	// mask
			char* mask = *line + 7;
			uint32 i;

			setMask = 0;
			fltMask = 0;
			for (i = 0; i < strlen(mask); ++i) {
				char cur = mask[i];

				assert(cur == '0' || cur == '1' || cur == 'X');

				switch (cur) {
				case 'X': {
					setMask = setMask << 1;
					fltMask = (fltMask << 1) + 1;
				} break;
				case '1': {
					setMask = (setMask << 1) + 1;
					fltMask = fltMask << 1;
				} break;
				default: {
					setMask = setMask << 1;
					fltMask = fltMask << 1;
				}
				}
			}
		} break;
		case 'e': {	//mem
			stb_uint64 index, v;
			stb_uint64* all;
			stb_uint64 *p;
			char* vstr = malloc(12 * (sizeof vstr));
			char* istr = malloc(12 * (sizeof istr));

			sscanf(*line, "mem[%llu] = %llu", &index, &v);
			index |= setMask;
			sprintf(vstr, "%llu", v);

			all = listFloating(index, fltMask);

			stb_arr_for(p, all) {
				sprintf(istr, "%llu", *p);
				stb_sdict_set(memory, istr, vstr);
			}
		}break;
		}
	}

	stb_sdict_for(memory, ivar, kvar, vvar) {
		stb_uint64 v = atoll((char*)vvar);
		sum += v;
	}

	return sum;
}

stb_uint64* listFloating(stb_uint64 index, stb_uint64 floatMask) {
	stb_uint64* result = NULL;

	computeAddresses(&result, index, floatMask, 0);

	return result;
}

void computeAddresses(stb_uint64** solutions, stb_uint64 index, stb_uint64 fltMask, int i) {


	if (i >= 36) {
		assert(index < (1ll << 36));
		stb_arr_push(*solutions, index);
		return;
	}

	assert(i < 36);

	if ((fltMask >> i) & 0x1 == 1) {
		index &= ~(1ll << i);
		computeAddresses(solutions, index, fltMask, i+1);
		index |= (1ll << i);
	}
	computeAddresses(solutions, index, fltMask, i+1);

	return;
}
