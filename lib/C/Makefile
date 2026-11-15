CC = gcc
CFLAGS = -Wall -Wextra -O2 -std=c99
CPPFLAGS = -I.
TARGET = Pmap
OBJS = pmap.o ../../test/Pmap.c

.PHONY: clean all

$(TARGET): $(OBJS)
	$(CC) $(CPPFLAGS) $(CFLAGS) $(OBJS) -o $(TARGET)

pmap.o: pmap.c
	$(CC) $(CFLAGS) -c $< -o $@

all: $(TARGET)

clean:
	rm -f pmap.o $(TARGET)