// https://adventofcode.com/2020/day/4
#define STB_DEFINE
#include "lib/stb.h"

#include <assert.h>

#define inputFile "input.txt"
#define testFile1 "test1.txt"
#define testFile2 "test2.txt"

int32 part1(char** rows);
int32 part2(char** rows);
void test(char* filename, int32 expected, int32 expected2);

int validate(const char* k, const char* v);

int main(void) {

	test(testFile1, 2, 2);
	test(testFile2, 8, 4);

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

	printf("Part 1: %d\n", p1);	// 182
	printf("Part 2: %d\n", p2);	// 109

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
	uint32 valid = 0;
	char** line;
	stb_sdict* passportInfo = stb_sdict_new(0);
	char* key = malloc(5 * (sizeof *key));
	char* val = malloc(30 * (sizeof *val));

	stb_arr_for(line, rows) {
		uint32 n;
		uint32 inLine = 0;
		uint32 d = 0;
		while ((n = sscanf(*line + d, "%3s:%s", key, val) == 2)) {
			d += strlen(key) + strlen(val) + 2;
			++inLine;
			if (0 != strcmp(key, "cid")) {	// Always ignore cid and require 1 less
				stb_sdict_add(passportInfo, key, val);
			}
		}

		if (inLine == 0) {
			// Blank line, next passport incoming
			n = stb_sdict_count(passportInfo);
			if (n == 7) {
				// Passport correct
				++valid;
			}
			stb_sdict_delete(passportInfo);
			passportInfo = stb_sdict_new(0);
		}
	}

	// Check for possible last row not followed by empty line
	if (stb_sdict_count(passportInfo) == 7) {
		// Passport correct
		++valid;
	}

	return valid;
}

int32 part2(char** rows) {
	uint32 valid = 0;
	char** line;
	stb_sdict* passportInfo = stb_sdict_new(0);
	char* key = malloc(5 * (sizeof *key));
	char* val = malloc(30 * (sizeof *val));
	int validation = TRUE;

	stb_arr_for(line, rows) {
		uint32 n;
		uint32 inLine = 0;
		uint32 d = 0;
		while ((n = sscanf(*line + d, "%3s:%s", key, val) == 2)) {
			d += strlen(key) + strlen(val) + 2;
			++inLine;
			if (0 != strcmp(key, "cid")) {	// Always ignore cid and require 1 less
				int ok = validate(key, val);
				validation &= ok;

				stb_sdict_add(passportInfo, key, val);
			}
		}

		if (inLine == 0) {
			// Blank line, next passport incoming
			n = stb_sdict_count(passportInfo);
			if (validation && n == 7) {
				// Passport correct
				++valid;
			}
			validation = TRUE;
			stb_sdict_delete(passportInfo);
			passportInfo = stb_sdict_new(0);
		}
	}

	// Check for possible last row not followed by empty line
	if (validation && stb_sdict_count(passportInfo) == 7) {
		// Passport correct
		++valid;
	}

	return valid;
}

int validate(const char* k, const char* v) {
	if (0 == strcmp(k, "byr")) {
		uint32 byr = atoi(v);
		return byr >= 1920 && byr <= 2002;
	}
	else if (0 == strcmp(k, "iyr")) {
		uint32 iyr = atoi(v);
		return iyr >= 2010 && iyr <= 2020;
	}
	else if (0 == strcmp(k, "eyr")) {
		uint32 eyr = atoi(v);
		return eyr >= 2020 && eyr <= 2030;
	}
	else if (0 == strcmp(k, "hgt")) {
		uint32 hgt;
		char mes[5];
		sscanf(v, "%d%s", &hgt, mes);
		if (0 == strcmp(mes, "cm")) {
			return hgt >= 150 && hgt <= 193;
		}
		else if (0 == strcmp(mes, "in")) {
			return hgt >= 59 && hgt <= 76;
		}
		return FALSE;
	}
	else if (0 == strcmp(k, "hcl")) {
		return strlen(v) == 7 && v[0] == '#' &&
			isxdigit(v[1]) && isxdigit(v[2]) &&
			isxdigit(v[3]) && isxdigit(v[4]) &&
			isxdigit(v[5]) && isxdigit(v[6]);
	}
	else if (0 == strcmp(k, "ecl")) {
		return !strcmp(v, "amb") || !strcmp(v, "blu") ||
			!strcmp(v, "brn") || !strcmp(v, "gry") ||
			!strcmp(v, "grn") || !strcmp(v, "hzl") || !strcmp(v, "oth");
	}
	else if (0 == strcmp(k, "pid")) {
		return strlen(v) == 9 &&
			isdigit(v[0]) && isdigit(v[1]) &&
			isdigit(v[2]) && isdigit(v[3]) &&
			isdigit(v[4]) && isdigit(v[5]) &&
			isdigit(v[6]) && isdigit(v[7]) &&
			isdigit(v[8]);
	}

	return FALSE;
}