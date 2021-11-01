#!python
# https://adventofcode.com/2019/day/24
from copy import deepcopy

dirs = ((1, 0), (0, 1), (-1, 0), (0, -1))


def addLayer(multiGrid, layer):
    if layer not in multiGrid:
        multiGrid[layer] = [['.' for _ in range(len(grid[0]))]
                            for _ in range(len(grid))]


def getAdjCount2(multiGrid, depth, i, j):
    count = 0

    if i == 0 or i == 4 or j == 0 or j == 4:
        if depth - 1 not in multiGrid:
            addLayer(multiGrid, depth - 1)
        for d in dirs:
            special = False
            x = j + d[0]
            y = i + d[1]
            if x < 0:
                count += int(multiGrid[depth - 1][2][1] == '#')
                special = True
            if y < 0:
                count += int(multiGrid[depth - 1][1][2] == '#')
                special = True
            if x > 4:
                count += int(multiGrid[depth - 1][2][3] == '#')
                special = True
            if y > 4:
                count += int(multiGrid[depth - 1][3][2] == '#')
                special = True

            if (not special and multiGrid[depth][y][x] == '#'):
                count += 1
    elif (i == 1 or i == 3 or j == 1 or j == 3) and i != j:
        if depth + 1 not in multiGrid:
            addLayer(multiGrid, depth + 1)
        for d in dirs:
            special = False
            x = j + d[0]
            y = i + d[1]
            if x == 2 and y == 2:
                special = True
                if j == 1 and i == 2:
                    count += int(multiGrid[depth + 1][0][0] == '#')
                    count += int(multiGrid[depth + 1][1][0] == '#')
                    count += int(multiGrid[depth + 1][2][0] == '#')
                    count += int(multiGrid[depth + 1][3][0] == '#')
                    count += int(multiGrid[depth + 1][4][0] == '#')
                elif j == 2 and i == 1:
                    count += int(multiGrid[depth + 1][0][0] == '#')
                    count += int(multiGrid[depth + 1][0][1] == '#')
                    count += int(multiGrid[depth + 1][0][2] == '#')
                    count += int(multiGrid[depth + 1][0][3] == '#')
                    count += int(multiGrid[depth + 1][0][4] == '#')
                elif j == 3 and i == 2:
                    count += int(multiGrid[depth + 1][0][4] == '#')
                    count += int(multiGrid[depth + 1][1][4] == '#')
                    count += int(multiGrid[depth + 1][2][4] == '#')
                    count += int(multiGrid[depth + 1][3][4] == '#')
                    count += int(multiGrid[depth + 1][4][4] == '#')
                elif j == 2 and i == 3:
                    count += int(multiGrid[depth + 1][4][0] == '#')
                    count += int(multiGrid[depth + 1][4][1] == '#')
                    count += int(multiGrid[depth + 1][4][2] == '#')
                    count += int(multiGrid[depth + 1][4][3] == '#')
                    count += int(multiGrid[depth + 1][4][4] == '#')

            if (not special and multiGrid[depth][y][x] == '#'):
                count += 1
    else:
        count = getAdjCount(multiGrid[depth], i, j)

    return count


def getAdjCount(g, i, j):
    count = 0

    for d in dirs:
        x = j + d[0]
        y = i + d[1]
        if (x < 0 or y < 0):
            continue
        try:
            if (g[y][x] == '#'):
                count += 1
        except IndexError:
            continue

    return count


def biodivRating(g):
    rating = 0
    for i in range(len(g)):
        for j in range(len(g[i])):
            if (g[i][j] == '#'):
                rating += 1 << (i * len(g[i]) + j)

    return rating


def countBugs(multiGrid):

    count = 0
    for k in multiGrid.keys():
        for i in range(len(multiGrid[k])):
            for j in range(len(multiGrid[k][i])):
                if multiGrid[k][i][j] == '#':
                    count += 1

    return count


assert biodivRating([['.', '.', '.', '.', '.'], ['.', '.', '.', '.', '.'],
                     ['.', '.', '.', '.', '.'], ['#', '.', '.', '.', '.'],
                     ['.', '#', '.', '.', '.']]) == 2129920

grid = []
with open('input.txt', 'r') as f:
    grid = [list(l.strip()) for l in f.readlines()]

pStates = [grid]
nextMinute = [['.' for _ in range(len(grid[0]))] for _ in range(len(grid))]
minute = 0

while (1):
    for i in range(len(grid)):
        for j in range(len(grid[i])):
            if (grid[i][j] == '#' and getAdjCount(grid, i, j) != 1):
                # Bug dies
                nextMinute[i][j] = '.'
            elif (grid[i][j] == '.' and getAdjCount(grid, i, j) in (1, 2)):
                # Infested
                nextMinute[i][j] = '#'
            else:
                nextMinute[i][j] = grid[i][j]

    if (nextMinute in pStates):
        print(biodivRating(nextMinute))  # Part 1: 18844281
        break

    pStates.append(deepcopy(nextMinute))
    grid = [[nextMinute[i][j] for j in range(len(nextMinute[i]))]
            for i in range(len(nextMinute))]
    minute += 1

multiGrid = {}
with open('input.txt', 'r') as f:
    multiGrid[0] = [list(l.strip()) for l in f.readlines()]

nextMinute = {}
addLayer(nextMinute, 0)

for minute in range(200):

    addLayer(multiGrid, minute + 1)
    addLayer(multiGrid, -minute - 1)
    addLayer(nextMinute, minute + 1)
    addLayer(nextMinute, -minute - 1)

    ks = list(multiGrid.keys())
    for depth in ks:
        for i in range(len(multiGrid[depth])):
            for j in range(len(multiGrid[depth][i])):
                if (i == 2 and j == 2): continue

                if (multiGrid[depth][i][j] == '#'
                        and getAdjCount2(multiGrid, depth, i, j) != 1):
                    # Bug dies
                    nextMinute[depth][i][j] = '.'
                elif (multiGrid[depth][i][j] == '.'
                      and getAdjCount2(multiGrid, depth, i, j) in (1, 2)):
                    # Infested
                    nextMinute[depth][i][j] = '#'
                else:
                    nextMinute[depth][i][j] = multiGrid[depth][i][j]

    for k in multiGrid.keys():
        if k not in nextMinute:
            addLayer(nextMinute, k)
    multiGrid = deepcopy(nextMinute)

print(countBugs(nextMinute))  # 1872