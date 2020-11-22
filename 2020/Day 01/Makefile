CC = gcc
CFLAGS = -Wall -Wextra -g
# CFLAGS = -O3
# LIBS = -lpthread
MKDCMD = mkdir -p

ODIR = ../obj
UDIR = ../utils

_OBJ = array.o string.o
OBJ = $(patsubst %,$(ODIR)/%,$(_OBJ))

DEPS = ../utils/utils.h

# BDIR = bin

main: $(OBJ) $(patsubst %,$(ODIR)/%,main.o)
	$(CC) -o $@ $^ $(CFLAGS) $(LIBS)

# test: $(OBJ)
# 	$(MKDCMD) $(BDIR)
# 	$(CC) src/list/list_test.c $^ -o $(BDIR)/list_test $(CFLAGS) $(LIBS)
# 	$(CC) src/graph/graph_test.c $^ -o $(BDIR)/graph_test $(CFLAGS) $(LIBS)
# 	$(CC) src/interval/interval_test.c $^ -o $(BDIR)/interval_test $(CFLAGS) $(LIBS)
# 	$(CC) src/utils/utils_test.c $^ -o $(BDIR)/utils_test $(CFLAGS) $(LIBS)

$(ODIR)/%.o: $(patsubst %,$(UDIR)/%,%.c) $(OBJ) $(ODIR)
	$(CC) -c -o $@ $< $(CFLAGS)

$(ODIR)/main.o: main.c $(OBJ) $(ODIR)
	$(CC) -c -o $@ $< $(CFLAGS)

$(ODIR):
	$(MKDCMD) $(ODIR)

clean:
	rm -rf $(ODIR)/*.o
	rm -rf $(ODIR)/
	rm -f main

.PHONY: clean
# .PHONY: test