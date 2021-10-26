// https://adventofcode.com/2020/day/17
#define STB_DEFINE
#include "../lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

#define ACTIVE '#'
#define INACTIVE '.'

#define COORD_FORMAT "%d,%d,%d"
#define COORD_FORMAT4 "%d,%d,%d,%d"

uint32 countAdjActive(stb_sdict* map, int32 x, int32 y, int32 z);
uint32 countAdjActive4(stb_sdict* map, int32 x, int32 y, int32 z, int32 w);

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 112, 848);

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

	printf("Part 1: %d\n", p1);
	printf("Part 2: %d\n", p2);

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
	stb_sdict* map = stb_sdict_new(0);
	int32 x, y, z;
	uint32 cycles;
	uint32 adjActive;
	char coord[100];
	int32 minx = 0, miny = 0, minz = 0, maxx = strlen(rows[0]), maxy = stb_arr_len(rows), maxz = 1;

	for (y = 0; y < stb_arr_len(rows); ++y) {
		for (x = 0; x < strlen(rows[y]); ++x) {
			if (rows[y][x] == INACTIVE) {
				continue;
			}

			sprintf(coord, COORD_FORMAT, x, y, 0);
			stb_sdict_set(map, coord, coord);
		}
	}

	for (cycles = 0; cycles < 6; ++cycles) {
		stb_sdict* newMap = stb_sdict_new(0);
		--minx;
		--miny;
		--minz;
		++maxx;
		++maxy;
		++maxz;

		for (x = minx; x < maxx; ++x) {
			for (y = miny; y < maxy; ++y) {
				for (z = minz; z < maxz; z++) {
					sprintf(coord, COORD_FORMAT, x, y, z);
					adjActive = countAdjActive(map, x, y, z);
					if (stb_sdict_get(map, coord) != NULL) {
						if (adjActive == 2 || adjActive == 3) {
							stb_sdict_set(newMap, coord, coord);
						}
					}
					else {
						if (adjActive == 3) {
							stb_sdict_set(newMap, coord, coord);
						}
					}
				}
			}
		}

		stb_sdict_delete(map);
		map = stb_sdict_copy(newMap);

		assert(stb_sdict_count(map) == stb_sdict_count(newMap));
	}

	return stb_sdict_count(map);
}

int32 part2(char** rows) {
	stb_sdict* map = stb_sdict_new(0);
	int32 x, y, z, w;
	uint32 cycles;
	uint32 adjActive;
	char coord[100];
	int32 minx = 0, miny = 0, minz = 0, minw = 0, maxx = strlen(rows[0]), maxy = stb_arr_len(rows), maxz = 1, maxw = 1;

	for (y = 0; y < stb_arr_len(rows); ++y) {
		for (x = 0; x < strlen(rows[y]); ++x) {
			if (rows[y][x] == INACTIVE) {
				continue;
			}

			sprintf(coord, COORD_FORMAT4, x, y, 0, 0);
			stb_sdict_set(map, coord, coord);
		}
	}

	for (cycles = 0; cycles < 6; ++cycles) {
		stb_sdict* newMap = stb_sdict_new(0);
		--minx;
		--miny;
		--minz;
		--minw;
		++maxx;
		++maxy;
		++maxz;
		++maxw;

		for (x = minx; x < maxx; ++x) {
			for (y = miny; y < maxy; ++y) {
				for (z = minz; z < maxz; z++) {
					for (w = minw; w < maxw; w++) {
						sprintf(coord, COORD_FORMAT4, x, y, z, w);
						adjActive = countAdjActive4(map, x, y, z, w);
						if (stb_sdict_get(map, coord) != NULL) {
							if (adjActive == 2 || adjActive == 3) {
								stb_sdict_set(newMap, coord, coord);
							}
						}
						else {
							if (adjActive == 3) {
								stb_sdict_set(newMap, coord, coord);
							}
						}
					}
				}
			}
		}

		stb_sdict_delete(map);
		map = stb_sdict_copy(newMap);

		assert(stb_sdict_count(map) == stb_sdict_count(newMap));
	}

	return stb_sdict_count(map);
}

uint32 countAdjActive(stb_sdict* map, int32 x, int32 y, int32 z) {
	int32 dx, dy, dz;
	char coord[100];
	uint32 adj = 0;

	for (dx = -1; dx <= 1; ++dx) {
		for (dy = -1; dy <= 1; ++dy) {
			for (dz = -1; dz <= 1; ++dz) {
				if (dx == 0 && dy == 0 && dz == 0) {
					continue;
				}

				sprintf(coord, COORD_FORMAT, x+dx, y+dy, z+dz);
				if (stb_sdict_get(map, coord) != NULL) {
					++adj;
				}
			}
		}
	}

	return adj;
}

uint32 countAdjActive4(stb_sdict* map, int32 x, int32 y, int32 z, int32 w) {
	int32 dx, dy, dz, dw;
	char coord[100];
	uint32 adj = 0;

	for (dx = -1; dx <= 1; ++dx) {
		for (dy = -1; dy <= 1; ++dy) {
			for (dz = -1; dz <= 1; ++dz) {
				for (dw = -1; dw <= 1; ++dw) {
					if (dx == 0 && dy == 0 && dz == 0 && dw == 0) {
						continue;
					}

					sprintf(coord, COORD_FORMAT4, x+dx, y+dy, z+dz, w+dw);
					if (stb_sdict_get(map, coord) != NULL) {
						++adj;
					}
				}
			}
		}
	}

	return adj;
}
