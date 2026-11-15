
#include "pmap.h"

#include <malloc.h>
#include <string.h>

static uint32_t mixer(uint32_t key, uint32_t R) {
  uint32_t x = R ^ key;
  x ^= x >> 16;
  x = x * 0x45d9f3b3;
  x = x + 0x9e3779b1;
  x = (x << 13) | (x >> 19);
  x ^= x >> 15;
  x *= 0x355d5bd9;
  x ^= x >> 16;
  return x;
}

static uint32_t _bitwise(uint32_t value, struct Meta* meta) {
  uint32_t L;
  uint32_t R;
  uint32_t prevL;
  int round;
  if (meta == NULL) return 0;
  L = value >> meta->options.bitwise.shift;
  R = value & meta->options.bitwise.mask;
  round = 0;
  while (round++ < ROUNDS) {
    prevL = L;
    L = R;
    R = prevL ^ mixer(meta->key, R);
  }
  return ((L << meta->options.bitwise.shift) | R) & (meta->limit - 1);
}

static uint32_t _sqrt(uint32_t value, struct Meta* meta) {
  uint32_t L;
  uint32_t R;
  uint32_t prevL;
  int round;
  if (meta == NULL) return 0;
  L = value / meta->options.sqrt.factor;
  R = value % meta->options.sqrt.factor;
  round = 0;
  while (round++ < ROUNDS) {
    prevL = L;
    L = R;
    R = prevL + mixer(meta->key, R);
  }
  return (L * meta->options.sqrt.factor + R) % meta->limit;
}

static size_t bit_length(unsigned long n) {
  size_t bits;
  for (bits = 0; n > 0; n >>= 1, bits++);
  return bits;
}

static size_t isqrt(unsigned long n) {
  size_t result;
  if (n == 0 || n == 1) return n;
  for (result = 1; result <= (n / result); result++);
  return result - 1;
}

static size_t get_index(int32_t value, struct Meta* meta) {
  return meta->bitwise ? _bitwise((uint32_t)value, meta)
                       : _sqrt((uint32_t)value, meta);
}

static int test(int32_t* keys, struct Meta* meta) {
  size_t idx;
  size_t i;
  size_t limit;
  size_t seq_size;
  int64_t* sequence;
  if (meta == NULL) return -1;
  i = 0;
  sequence = meta->sequence;
  limit = meta->limit;
  seq_size = limit * sizeof(int64_t);
  while (i < limit) {
    idx = get_index(keys[i], meta);
    if (i != 0 && sequence[idx] != -1) {
      memset(sequence, -1, seq_size);
      meta->key++;
      i = 0;
      continue;
    }
    sequence[idx] = i;
    i++;
  }
  return 0;
}

int p_init(struct Meta* meta, int32_t* keys, size_t size, unsigned long key) {
  size_t half;
  size_t seq_size;
  if (size < 1 || meta == NULL) return -1;
  seq_size = size * sizeof(int64_t);
  meta->key = key;
  meta->limit = size;
  meta->sequence = malloc(seq_size);
  if (meta->sequence == NULL) return -1;
  memset(meta->sequence, -1, seq_size);
  if ((size & (size - 1)) == 0) {
    half = (bit_length(size) - 1) / 2;
    meta->options.bitwise.shift = half;
    meta->options.bitwise.mask = (1lu << half) - 1;
    meta->bitwise = 1;
  } else {
    half = isqrt(size);
    while ((size % half) != 0) half--;
    meta->options.sqrt.factor = size / half;
    meta->bitwise = 0;
  }
  return test(keys, meta);
}

int64_t p_index(struct Meta* meta, int32_t key) {
  return meta->sequence[get_index(key, meta)];
}

void p_destroy(struct Meta* meta) {
  free(meta->sequence);
  meta->sequence = NULL;
}