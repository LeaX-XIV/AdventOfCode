#!python
# https://adventofcode.com/2019/day/25
from ICProgram import ICProgram as ICP
from threading import Thread
import sys

auto = False
commands = \
list(reversed('''west
take fixed point
north
take sand
south
east
east
north
north
north
take coin
south
south
west
north
take spool of cat6
north
west
north
'''))
prevch = '\0'


def listen(icp):
    global prevch
    while (icp.waitForOutput()):
        ch = chr(icp.getOutput())
        if (auto):
            if (prevch == ' ' or prevch.isdigit()) and ch.isdecimal():
                print(ch, end='')  # Part 1: 2181046280
            prevch = ch
        else:
            print(ch, end='')


if (len(sys.argv) > 1 and sys.argv[1] == '-auto'):
    auto = True

program = []
with open('input.txt', 'r') as f:
    program = f.readlines()[0].strip().split(',')

droid = ICP()
droid.loadProgram(program)
droid.start()

t = Thread(target=listen, args=(droid, ), daemon=True)
t.start()

if auto:
    while len(commands) > 0:
        ch = commands.pop()
        droid.feedInput(ord(ch))
    t.join()
else:
    while (1):
        for c in input():
            droid.feedInput(ord(c))
        droid.feedInput(10)