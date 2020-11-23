#ifndef UTILS_H
#define UTILS_H

/***************************************************************************
********************************* ARRAY ************************************
***************************************************************************/

typedef struct _array* array_t;

array_t	array_create(size_t num, size_t chunksize);
void	array_destroy(array_t arr);
void	array_fill(array_t arr, void* data);
void	array_insert(array_t arr, size_t pos, void* data);
void	array_get(array_t arr, size_t pos, void* buf);
void	array_push(array_t arr, void* data);
void	array_pop(array_t arr, void* buf);
void	array_enqueue(array_t arr, void* data);
void	array_dequeue(array_t arr, void* buf);
size_t	array_length(array_t arr);
array_t	array_copy(array_t arr);
void 	array_append(array_t arr1, array_t arr2);

/***************************************************************************
********************************* STRING ***********************************
***************************************************************************/

typedef struct _string* string_t;

string_t	string_fromCharArray(char* cstr);
string_t	string_fromFile(char* filepath);
void		string_destroy(string_t str);
size_t		string_length(string_t str);
void		string_print(FILE* fp, string_t str);
char*		string_toCharArray(string_t str);

#endif