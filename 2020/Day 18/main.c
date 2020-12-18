// https://adventofcode.com/2020/day/18
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"
#define testFile2 "test2.txt"
#define testFile3 "test3.txt"
#define testFile4 "test4.txt"
#define testFile5 "test5.txt"
#define testFile6 "test6.txt"

#define PLUS -1
#define TIMES -2
#define OPENP -3
#define CLOSEP -4

stb_uint64 parseR(char* line, int32* pos);
stb_uint64 parseRAdvanced(char* line);
void printStack(stb_int64* s);
stb_int64 asInt(char c);

stb_uint64 part1(char** rows);
stb_uint64 part2(char** rows);
void test(char* filename, stb_uint64 expected, stb_uint64 expected2);

int main(void) {

	test(testFile1, 71, 231);
	test(testFile2, 51, 51);
	test(testFile3, 26, 46);
	test(testFile4, 437, 1445);
	test(testFile5, 12240, 669060);
	test(testFile6, 13632, 23340);

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

	printf("Part 1: %llu\n", p1);	// 36382392389406
	printf("Part 2: %llu\n", p2);

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
	stb_uint64 sum = 0;
	char** line;

	stb_arr_for(line, rows) {
		uint32 i = 0;
		sum += parseR(*line, &i);
	}

	return sum;
}

stb_uint64 part2(char** rows) {
	stb_uint64 sum = 0;
	char** line;

	stb_arr_for(line, rows) {
		stb_uint64 s = parseRAdvanced(*line);
		printf("%lld = %s\n", s, *line);
		sum += s;
	}

	return sum;
}

stb_uint64 parseR(char* line, int32* pos) {
	stb_uint64 res = 0;
	char op = 0;

	for (; *pos < strlen(line); ++*pos) {
		if (line[*pos] == ' ') continue;
		if (line[*pos] == ')') break;
		if (line[*pos] == '(') {
			++*pos;
			stb_uint64 r = parseR(line, pos);

			switch (op) {
			case 0: res = r; break;
			case '+': res += r; break;
			case '*': res *= r; break;
			default: printf("Oopsie!\n");
			}
		}
		if (isdigit(line[*pos])) {
			stb_uint64 r = atoi(line + *pos);
			switch (op) {
			case 0: res = r; break;
			case '+': res += r; break;
			case '*': res *= r; break;
			default: printf("Oopsie!\n");
			}
		}
		if (line[*pos] == '+' || line[*pos] == '*') {
			op = line[*pos];
		}
	}

	return res;
}

stb_uint64 parseRAdvanced(char* line) {
	stb_int64* stack = NULL;
	uint32 i;

	for (i = 0; i < strlen(line); ++i) {
		if (line[i] == ' ') continue;

		stb_arr_push(stack, asInt(line[i]));
		// printStack(stack);

		if (stack[stb_arr_len(stack) - 1] == CLOSEP) {
			stb_int64 p;
			stb_uint64 runningProd = 1;
			assert(stb_arr_pop(stack) == CLOSEP);

			while ((p = stb_arr_pop(stack)) != OPENP) {
				if (p > 0) {
					runningProd *= p;
				}
				else {
					assert(p == TIMES);
				}
			}

			stb_arr_push(stack, runningProd);
			// printStack(stack);
		}

		if (stb_arr_len(stack) > 2 && stack[stb_arr_len(stack) - 2] == PLUS && stack[stb_arr_len(stack) - 1] > 0) {
			uint32 a = stb_arr_pop(stack);
			assert(stb_arr_pop(stack) == PLUS);
			uint32 b = stb_arr_pop(stack);

			stb_arr_push(stack, a+b);
			// printStack(stack);
		}
	}

	stb_uint64 res = stb_arr_pop(stack);

	while (stb_arr_len(stack) > 0) {
		stb_int64 p = stb_arr_pop(stack);
		if (p > 0) {
			res *= p;
		}
		else {
			assert(p == TIMES);
		}
	}
	// printf("%llu\n", res);

	return res;
}

void printStack(stb_int64* s) {
	uint32 i;

	for (i = 0; i < stb_arr_len(s); ++i) {
		switch (s[i]) {
		case PLUS: printf("%c ", '+'); break;
		case TIMES: printf("%c ", '*'); break;
		case OPENP: printf("%c ", '('); break;
		case CLOSEP: printf("%c ", ')'); break;
		default: printf("%lld ", s[i]);
		}
	}
	printf("\n");
}

stb_int64 asInt(char c) {
	if (isdigit(c)) {
		return c - '0';
	}
	else {
		switch (c) {
		case '+': return PLUS;
		case '*': return TIMES;
		case '(': return OPENP;
		case ')': return CLOSEP;
		}
	}
}