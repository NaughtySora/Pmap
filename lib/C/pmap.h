#ifndef __H_PMAP
#define __H_PMAP

#include <stdint.h>
#include <stdlib.h>

#define ROUNDS 2

struct Meta {
  unsigned int key;
  union Options {
    struct Bitwise {
      size_t shift;
      size_t mask;
    } bitwise;
    struct {
      size_t factor;
    } sqrt;
  } options;
  int bitwise;
  size_t limit;
  int64_t* sequence;
};

int p_init(struct Meta* meta, int32_t* keys, size_t size, unsigned long key);
int64_t p_index(struct Meta* meta, int32_t key);
void p_destroy(struct Meta* meta);
#endif