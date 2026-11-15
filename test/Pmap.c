#include "pmap.h"

#include <inttypes.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ARRAY_SIZE(array) sizeof(array) / sizeof(array[0])

void test(int32_t keys[], size_t size) {
  size_t i;
  struct Meta ma;
  int32_t* values = malloc(size * sizeof(int32_t));
  if (values == NULL) {
    fprintf(stderr, "couldn't allocate values\n");
    exit(EXIT_FAILURE);
  }
  memcpy(values, keys, size * sizeof(int32_t));
  p_init(&ma, keys, size, 0);
  for (i = 0; i < size; i++) {
    if (values[p_index(&ma, keys[i])] != values[i]) {
      fprintf(stderr, "values (%" PRId32 ", %" PRId32 ") are not equal\n",
        values[p_index(&ma, keys[i])], values[i]);
      exit(EXIT_FAILURE);
    }
  }
  p_destroy(&ma);
  free(values);
}

int main(void) {
  {
    int32_t keys[] = {142, -538, -368, 435, 913, -759, -367, 95, 417, -462,
      -649, 274};
    test(keys, ARRAY_SIZE(keys));
  }
  {
    int32_t keys[] = {-179, 910, -966, -694, 710, 712, 591, -78};
    test(keys, ARRAY_SIZE(keys));
  }
  return EXIT_SUCCESS;
}