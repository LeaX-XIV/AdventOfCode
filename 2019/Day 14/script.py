#!python
# https://adventofcode.com/2019/day/14
import re

def produce(output, q):
	need = {output: q}
	i = 0
	while(1):
		mat = list(need.keys())[i]
		q = need[mat]
		if(q > 0):
			if(mat == 'ORE'):
				i = (i + 1) % len(need)
				continue
			for src in graph[mat]:
				if(src['input'] not in need):
					need[src['input']] = 0
				produced = (q // src['qo'] + (0 if q % src['qo'] == 0 else 1)) * src['qi']
				need[src['input']] += produced
			need[mat] -= produced // src['qi'] * src['qo']
		i = (i + 1) % len(need)
		if(len(list(filter(lambda k: k != 'ORE' and need[k] > 0, need.keys()))) == 0):
			return need

pattern = '(\\d+) (\\w+)'

lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()

graph = {}
for line in lines:
	i = line.index('=>')
	if(m := re.search(pattern, line[i:])):
		q = int(m.group(1))
		output = m.group(2)

		edges = []
		for match in re.finditer(pattern, line[:i]):
			edges.append({
				'input': match.group(2),
				'qi': int(match.group(1)),
				'qo': q})
		graph[output] = edges

p = produce('FUEL', 1)
print(p['ORE']) # Part 1: 1920219
remOre = 1000000000000 % p['ORE']
min = 1000000000000 // p['ORE']
i = 0
step = 1000
while(abs(step) > 1):
	if(step > 0):
		if(produce('FUEL', min + i)['ORE'] > 1000000000000):
			step = -1 * step // 2
	else:
		if(produce('FUEL', min + i)['ORE'] < 1000000000000):
			step = -1 * step // 2
	i += step

print(min + i)	# Part 2: 1330066
