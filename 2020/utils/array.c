#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "utils.h"

struct _array {
	void* data;
	size_t n_allocatedchunks;
	size_t n_usedchunks;
	size_t chunksize;
};

struct _array* array_init(void);
void array_resize(struct _array* arr, size_t n_newchunks);

struct _array* array_init(void) {
	struct _array* arr = malloc(1 * (sizeof *arr));

	arr->data = NULL;
	arr->n_allocatedchunks = 0;
	arr->n_usedchunks = 0;
	arr->chunksize = 0;

	return arr;
}

void array_resize(struct _array* arr, size_t n_newchunks) {
	assert(arr != NULL);

	size_t newsize = n_newchunks * arr->chunksize;
	void* newptr = realloc(arr->data, newsize);
	
	assert(newptr != NULL);

	return;
}

struct _array* array_create(size_t num, size_t chunksize) {
	struct _array* arr = array_init();

	arr->data = malloc(num * chunksize);
	arr->n_allocatedchunks = num;
	arr->n_usedchunks = 0;
	arr->chunksize = chunksize;

	return arr;
}

void array_destroy(struct _array* arr) {
	assert(arr != NULL);

	if(arr->data != NULL) {
		free(arr->data);
	}

	free(arr);
	return;
}

void array_fill(struct _array* arr, void* data) {
	assert(arr != NULL);
	assert(data != NULL);

	void* p;
	void* end = arr->data + arr->n_allocatedchunks * arr->chunksize;
	for(p = arr->data; p < end; p += arr->chunksize) {
		memcpy(p, data, arr->chunksize);
	}
	arr->n_usedchunks = arr->n_allocatedchunks;

	return;
}

void array_insert(struct _array* arr, size_t pos, void* data) {
	assert(arr != NULL);
	assert(data != NULL);

	if(pos < arr->n_usedchunks) {
		size_t displacement = pos * arr->chunksize;
		memcpy(arr->data + displacement, data, arr->chunksize);
	}

	return;
}

void array_get(struct _array* arr, size_t pos, void* buf) {
	assert(arr != NULL);
	assert(buf != NULL);

	if(pos < arr->n_usedchunks) {
		size_t displacement = pos * arr->chunksize;
		memcpy(buf, arr->data + displacement, arr->chunksize);
	}

	return;
}

void array_push(struct _array* arr, void* data) {
	assert(arr != NULL);
	assert(data != NULL);

	if(arr->n_usedchunks >= arr->n_allocatedchunks) {
		size_t newchunks = arr->n_allocatedchunks == 0 ? 2 : 2 * arr->n_allocatedchunks;
		array_resize(arr, newchunks);
	}

	size_t displacement = arr->n_usedchunks * arr->chunksize;
	memcpy(arr->data + displacement, data, arr->chunksize);
	++arr->n_usedchunks;

	return;
}

void array_pop(struct _array* arr, void* buf) {
	assert(arr != NULL);

	if(arr->n_usedchunks > 0) {
		--arr->n_usedchunks;
		if(buf != NULL) {
			size_t displacement = arr->n_usedchunks * arr->chunksize;
			memcpy(buf, arr->data + displacement, arr->chunksize);
		}
	}

	if(2 * arr->n_usedchunks < arr->n_allocatedchunks) {
		size_t newchunks = arr->n_allocatedchunks / 2;
		array_resize(arr, newchunks);
	}

	return;
}

void array_enqueue(struct _array* arr, void* data) {
	assert(arr != NULL);
	assert(data != NULL);

	if(arr->n_usedchunks >= arr->n_allocatedchunks) {
		size_t newchunks = arr->n_allocatedchunks == 0 ? 2 : 2 * arr->n_allocatedchunks;
		array_resize(arr, newchunks);
	}

	size_t displacement = arr->chunksize;
	size_t size = arr->n_usedchunks * arr->chunksize;
	memmove(arr->data + displacement, arr->data, size);
	memcpy(arr->data, data, arr->chunksize);
	++arr->n_usedchunks;

	return;
}

void array_dequeue(struct _array* arr, void* buf) {
	assert(arr != NULL);

	if(arr->n_usedchunks > 0) {
		--arr->n_usedchunks;
		if(buf != NULL) {
			memcpy(buf, arr->data, arr->chunksize);
		}
		size_t displacement = arr->chunksize;
		size_t size = arr->n_usedchunks * arr->chunksize;
		memmove(arr->data, arr->data + displacement, size);
	}

	if(2 * arr->n_usedchunks < arr->n_allocatedchunks) {
		size_t newchunks = arr->n_allocatedchunks / 2;
		array_resize(arr, newchunks);
	}

	return;
}

struct _array* array_copy(struct _array* arr) {
	assert(arr != NULL);

	struct _array* copy = array_create(arr->n_allocatedchunks, arr->chunksize);

	size_t size = arr->n_allocatedchunks * arr->chunksize;
	memcpy(copy->data, arr->data, size);
	copy->n_usedchunks = arr->n_usedchunks;

	return copy;
}