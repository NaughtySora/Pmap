# Permutation Map

## Disadvantages
- For "production" use sequence should be generate beforehand.
- Updating mapping requires to regenerate and place sequence manually.
- Requires map to be static.
- Large mapping will require an enormous amount of resources, sometimes even infinite.

## Advantages
- Pretty simple, No buckets, no tree rotations.
- Customizable (cycles, mixers).
- Can be used without pre generation in test environments.
- The cost of usage can be seen beforehand (when testing for a sequence).

## Performance
#### JS
- Rough testing showed that for 1000000 lookups js implemented Pmap only ~19.5% slower \
against C++ implemented js Map.
I'm sure I can even find better mixer or implement map even better.

## Notes
I was researching permutation in both mathematics and programming in the context of\
pseudo random number generators (PRNG).\
I was wondering could permutation be used to create mapping.\
I'm sure this approach is pretty unusual but can be handy in some specific situations.
