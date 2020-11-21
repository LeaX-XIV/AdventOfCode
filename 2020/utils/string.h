#ifndef STRING_H
#define STRING_H

typedef struct _string* string_t;

string_t string_fromCharArray(char*);
string_t string_fromFile(char*);
void string_destroy(string_t);

size_t string_length(string_t);
void string_print(FILE*, string_t);
char* string_toCharArray(string_t);

#endif