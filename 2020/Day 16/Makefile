CC = gcc
CFLAGS = -Wall -Wextra -g
# CFLAGS = -O3
CFLAGSSIMPLE = -g
LIBS = -lm
MKDCMD = mkdir -p

ODIR = obj

_OBJ =
OBJ = $(patsubst %,$(ODIR)/%,$(_OBJ))

DEPS = ../lib/stb.h

main: $(OBJ) $(patsubst %,$(ODIR)/%,main.o)
	$(CC) -o $@ $^ $(CFLAGS) $(LIBS)

$(ODIR)/%.o: $(patsubst %,$(UDIR)/%,%.c) $(OBJ) $(ODIR) $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

$(ODIR)/main.o: main.c $(OBJ) $(ODIR) $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGSSIMPLE)

$(ODIR):
	$(MKDCMD) $(ODIR)

clean:
	rm -rf $(ODIR)/*.o
	rm -rf $(ODIR)/
	rm -f main

.PHONY: clean
