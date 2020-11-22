#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "utils.h"

struct _string {
	char* s;
	size_t l;
};

struct _string* string_init(void);

struct _string* string_init(void) {
	struct _string* str = malloc(1 * (sizeof *str));

	str->s = NULL;
	str->l = 0;

	return str;	
}

struct _string* string_fromCharArray(char* cstr) {
	if(arr == NULL) {
		exit(EXIT_FAILURE);
	}

	struct _string* str = string_init();
	
	str->l = strlen(cstr);

	str->s = malloc(str->l);
	strcpy(str->s, cstr);

	return str;
}

struct _string* string_fromFile(char* filepath) {
	if(filename == NULL) {
		exit(EXIT_FAILURE);
	}
	
	struct _string* str;
	FILE* fp;
	char ch;
	size_t n_chars = 0;
	int i;

	fp = fopen(filepath, "r");
	if(fp == NULL) {
		exit(EXIT_FAILURE);
	}
	
	while ((ch = fgetc(fp)) != EOF) {
		++n_chars;
    }
	fseek(fp, 0, SEEK_SET);

	str = string_init();
	str->s = malloc((n_chars + 1) * (sizeof *str->s));
	
	for(i = 0; i < n_chars; ++i) {
		str->s[i] = fgetc(fp);
	}
	str->s[n_chars] = '\0';

	// char* p = str->s;
	// void* end;
	// for(end = &str->s[n_chars]; p != end; ++p) {
	// 	*p = fgetc(fp);
	// }
	// *p = '\0';

	str->l = n_chars;

	fclose(fp);
	return str;
}

void string_destroy(struct _string* str) {
	if(str == NULL) {
		exit(EXIT_FAILURE);
	}

	if(str->s != NULL) {
		free(str->s);
	}

	free(str);

	return;
}

size_t string_length(struct _string* str) {
	if(str == NULL) {
		exit(EXIT_FAILURE);
	}

	size_t length = str->l;

	return length;
}

void string_print(FILE* fp, struct _string* str) {
	if(fp == NULL || str == NULL) {
		exit(EXIT_FAILURE);
	}

	if(str->s != NULL) {
		fprintf(fp, "%s", str->s);
	}

	return;
}

char* string_toCharArray(struct _string* str) {
	if(str == NULL) {
		exit(EXIT_FAILURE);
	}

	char* arr = malloc((str->l + 1) * (sizeof *arr));
	strcpy(str->s, arr);

	return arr;
}