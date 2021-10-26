// https://adventofcode.com/2020/day/11
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

#define EMPTY 'L'
#define OCCUPIED '#'
#define FLOOR '.'

uint32 tick(char*** grid, uint32 limit, uint8 onlyAdj);
uint32 countAdjOccupied(char** grid, int32 x, int32 y);
uint32 countOccupied(char** grid, uint32 x, uint32 y);
void print(char** grid);

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 37, 26);

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

	printf("Part 1: %d\n", p1);	// 2108
	printf("Part 2: %d\n", p2);	// 1897

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
	uint32 count = 0;
	uint32 x, y;

	while (tick(&rows, 4, TRUE) > 0);

	for (y = 0; y < stb_arr_len(rows); ++y) {
		for (x = 0; x < strlen(rows[y]); ++x) {
			count += rows[y][x] == OCCUPIED;
		}
	}

	return count;
}

int32 part2(char** rows) {
	uint32 count = 0;
	uint32 x, y;

	while (tick(&rows, 5, FALSE) > 0);

	for (y = 0; y < stb_arr_len(rows); ++y) {
		for (x = 0; x < strlen(rows[y]); ++x) {
			count += rows[y][x] == OCCUPIED;
		}
	}

	return count;
}

uint32 tick(char*** grid, uint32 limit, uint8 onlyAdj) {
	char** newGrid = NULL;
	uint32 changed = 0;
	uint32 x, y;

	for (y = 0; y < stb_arr_len(*grid); ++y) {
		char* copy = malloc(strlen((*grid)[y]) * (sizeof *copy));
		strcpy(copy, (*grid)[y]);

		stb_arr_push(newGrid, copy);
	}

	for (y = 0; y < stb_arr_len(*grid); ++y) {
		for (x = 0; x < strlen((*grid)[y]); ++x) {
			uint32 adj;

			if (onlyAdj == TRUE) {
				adj = countAdjOccupied(*grid, x, y);
			}
			else {
				adj = countOccupied(*grid, x, y);
			}

			assert(adj >= 0 && adj < 9);
			assert((*grid)[y][x] == EMPTY || (*grid)[y][x] == OCCUPIED || (*grid)[y][x] == FLOOR);

			if ((*grid)[y][x] == EMPTY && adj == 0) {
				newGrid[y][x] = OCCUPIED;
				++changed;
				assert((*grid)[y][x] != newGrid[y][x]);
			}
			else if ((*grid)[y][x] == OCCUPIED && adj >= limit) {
				newGrid[y][x] = EMPTY;
				++changed;
				assert((*grid)[y][x] != newGrid[y][x]);
			}
		}
	}

	*grid = newGrid;

	return changed;
}

uint32 countAdjOccupied(char** grid, int32 x, int32 y) {
	uint32 count = 0;
	int32 dx, dy;
	if (grid[y][x] == FLOOR) { return count; }

	for (dy = -1; dy <= 1; ++dy) {
		for (dx = -1; dx <= 1; ++dx) {
			if (x+dx < 0 || x+dx >= strlen(grid[y]) || y+dy < 0 || y+dy >= stb_arr_len(grid) || (dx == 0 && dy == 0)) {
				continue;
			}

			if (grid[y+dy][x+dx] == OCCUPIED) {
				++count;
			}
		}
	}

	return count;
}

uint32 countOccupied(char** grid, uint32 x, uint32 y) {
	uint32 count = 0;
	int32 dx, dy;
	if (grid[y][x] == FLOOR) { return count; }

	// Check 1 direction at a time
	// NW
	for (dx = -1, dy = -1; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); --dx, --dy) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	// N
	for (dx = 0, dy = -1; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); --dy) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	// NE
	for (dx = 1, dy = -1; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); ++dx, --dy) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	// E
	for (dx = 1, dy = 0; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); ++dx) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	// SE
	for (dx = 1, dy = 1; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); ++dx, ++dy) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	// S
	for (dx = 0, dy = 1; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); ++dy) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	// SW
	for (dx = -1, dy = 1; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); --dx, ++dy) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	// W
	for (dx = -1, dy = 0; x+dx >= 0 && x+dx < strlen(grid[y]) && y+dy >= 0 && y+dy < stb_arr_len(grid); --dx) {
		assert(grid[y+dy][x+dx] == EMPTY || grid[y+dy][x+dx] == OCCUPIED || grid[y+dy][x+dx] == FLOOR);
		if (grid[y+dy][x+dx] == FLOOR) {
			continue;
		}
		if (grid[y+dy][x+dx] == OCCUPIED) {
			++count;
		}
		break;
	}

	return count;
}

void print(char** grid) {
	uint32 y;

	for (y = 0; y < stb_arr_len(grid); ++y) {
		printf("%s\n", grid[y]);
	}

	return;
}
