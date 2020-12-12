// https://adventofcode.com/2020/day/12
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"

#define NORTH 'N'
#define EAST 'E'
#define SOUTH 'S'
#define WEST 'W'
#define RIGHT 'R'
#define LEFT 'L'
#define FORWARD 'F'

typedef struct {
	stb_int64 n, e;
	stb_int64 wpn, wpe;
	uint32 dir;
} dir_point;

stb_int64 part1(char** rows);
stb_int64 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int main(void) {

	test(testFile1, 25, 286);

	FILE* fp;
	char** rows = NULL;
	char* row;
	stb_int64 p1, p2;

	fp = fopen(inputFile, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	p2 = part2(rows);

	printf("Part 1: %lld\n", p1);
	printf("Part 2: %lld\n", p2);

	return EXIT_SUCCESS;
}

void test(char* filename, int32 expected1, int32 expected2) {
	FILE* fp;
	char** rows = NULL;
	char* row;
	stb_int64 p1, p2;

	fp = fopen(filename, "rb");
	while ((row = stb_fgets_malloc(fp)) != NULL) {
		stb_arr_push(rows, row);
	}
	p1 = part1(rows);
	p2 = part2(rows);

	assert(expected1 == p1);
	assert(expected2 == p2);
}

stb_int64 part1(char** rows) {
	dir_point* ship = calloc(1, (sizeof *ship));
	char** line;

	stb_arr_for(line, rows) {
		char cmd = (*line)[0];
		int val = atoi(*line + 1);

		switch (cmd) {
		case NORTH: ship->n += val;
			break;
		case EAST: ship->e += val;
			break;
		case SOUTH: ship->n -= val;
			break;
		case WEST: ship->n -= val;
			break;
		case RIGHT: ship->dir = (ship->dir - val + 360) % 360;
			break;
		case LEFT: ship->dir = (ship->dir + val + 360) % 360;
			break;
		case FORWARD: {
			switch (ship->dir) {
			case 0: ship->e += val;
				break;
			case 90: ship->n += val;
				break;
			case 180: ship->e -= val;
				break;
			case 270: ship->n -= val;
				break;
			default:
				break;
			}
			// ship->n += val * sin((double)ship->dir / 180.0 * M_PI);
			// ship->e += val * cos((double)ship->dir / 180.0 * M_PI);
		} break;

		default:
			break;
		}
	}

	return abs(ship->n) + abs(ship->e);
}

stb_int64 part2(char** rows) {
	dir_point* ship = calloc(1, (sizeof *ship));
	char** line;

	ship->wpn = 1;
	ship->wpe = 10;
	stb_arr_for(line, rows) {
		char cmd = (*line)[0];
		int val = atoi(*line + 1);

		switch (cmd) {
		case NORTH: ship->wpn += val;
			break;
		case EAST: ship->wpe += val;
			break;
		case SOUTH: ship->wpn -= val;
			break;
		case WEST: ship->wpe -= val;
			break;
		case RIGHT: {
			switch (val) {
			case 0:
				break;
			case 90: {
				int32 t = ship->wpn;
				ship->wpn = -ship->wpe;
				ship->wpe = t;
			} break;
			case 180: {
				ship->wpn *= -1;
				ship->wpe *= -1;
			} break;
			case 270: {
				int32 t = ship->wpe;
				ship->wpe = -ship->wpn;
				ship->wpn = t;
			} break;
			default:
				break;
			}
		} break;
		case LEFT: {
			switch (val) {
			case 0:
				break;
			case 90: {
				int32 t = ship->wpe;
				ship->wpe = -ship->wpn;
				ship->wpn = t;
			} break;
			case 180: {
				ship->wpn *= -1;
				ship->wpe *= -1;
			} break;
			case 270: {
				int32 t = ship->wpn;
				ship->wpn = -ship->wpe;
				ship->wpe = t;
			} break;
			default:
				break;
			}
		} break;
		case FORWARD: {
			ship->n += val * ship->wpn;
			ship->e += val * ship->wpe;
		} break;

		default:
			break;
		}
	}

	return abs(ship->n) + abs(ship->e);
}