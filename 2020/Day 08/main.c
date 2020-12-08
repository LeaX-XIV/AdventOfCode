// https://adventofcode.com/2020/day/8
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

#define ACC "acc"
#define JMP "jmp"
#define NOP "nop"

typedef struct {
	uint8* visited;
	int32 acc;
	uint32 pc;
	int32 n_safe;
} state;

uint8 execute(state* s, char* instruction);

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 5, 8);

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

	printf("Part 1: %d\n", p1);	// 1331
	printf("Part 2: %d\n", p2);	// 1121

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
	state* s = calloc(1, sizeof(*s));
	s->n_safe = -1;
	s->visited = calloc(stb_arr_len(rows), (sizeof *s->visited));

	assert(s->acc == 0);
	assert(s->pc == 0);

	while (s->visited[s->pc] == FALSE) {
		s->visited[s->pc] = TRUE;

		uint8 jump = execute(s, rows[s->pc]);
	}

	int32 acc = s->acc;
	free(s->visited);
	free(s);
	return acc;
}

int32 part2(char** rows) {
	state* s = calloc(1, sizeof(*s));
	s->visited = calloc(stb_arr_len(rows), (sizeof *s->visited));
	uint32 i;

	for (i = 0; i < stb_arr_len(rows); ++i) {
		s->n_safe = i;
		if (rows[s->n_safe][0] == 'a') {
			continue;
		}

		s->acc = 0;
		free(s->visited);
		s->visited = calloc(stb_arr_len(rows), (sizeof *s->visited));
		s->pc = 0;

		while (s->visited[s->pc] == FALSE && s->pc < stb_arr_len(rows)) {
			s->visited[s->pc] = TRUE;

			uint8 jump = execute(s, rows[s->pc]);
		}

		if (s->pc >= stb_arr_len(rows)) {
			return s->acc;
		}
	}

	return 0;
}

uint8 execute(state* s, char* instruction) {
	assert(s != NULL);
	assert(instruction != NULL);

	char op[5];
	uint32 v;

	sscanf(instruction, "%3s %d", op, &v);

	if (s->pc == s->n_safe) {
		if (0 == strcmp(op, JMP)) {
			strcpy(op, NOP);
		}
		else if (0 == strcmp(op, NOP)) {
			strcpy(op, JMP);
		}
	}

	// printf("%4d ## %s\n", s->pc, instruction);

	if (0 == strcmp(op, ACC)) {
		s->acc += v;
		s->pc++;
	}
	else if (0 == strcmp(op, JMP)) {
		s->pc += v;
	}
	else if (0 == strcmp(op, NOP)) {
		s->pc++;
	}

	return 0 == strcmp(op, JMP);
}