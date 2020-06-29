#!python

from enum import Enum, auto, unique
from queue import Queue
from threading import Thread

@unique
class ICPState(Enum):
	OFF = auto()
	HALTED = auto()
	RUNNING = auto()
	WAITING = auto()
	FINISHED = auto()

class ICProgram:

	ops = {
		# Add
		1: lambda self, v1, v2, dst: self.memory.__setitem__(dst, v1 + v2),
		# Multiply
		2: lambda self, v1, v2, dst: self.memory.__setitem__(dst, v1 * v2),
		# Input
		3: lambda self, p: self.memory.__setitem__(p, self.inputBuffer.get()),
		# Output
		4: lambda self, p: (self.outputBuffer.put(p)),
		# Jump if True
		5: lambda self, v1, v2: ICProgram.__setattr__(self, 'ip', v2 if v1 != 0 else self.ip),
		# Jump if False
		6: lambda self, v1, v2: ICProgram.__setattr__(self, 'ip', v2 if v1 == 0 else self.ip),
		# Lower than
		7: lambda self, v1, v2, dst: self.memory.__setitem__(dst, 1 if v1 < v2 else 0),
		# Equals
		8: lambda self, v1, v2, dst: self.memory.__setitem__(dst, 1 if v1 == v2 else 0),
		# Relative Base Adjust
		9: lambda self, a: ICProgram.__setattr__(self, 'relBase', ICProgram.__getattribute__(self, 'relBase') + a),
		# Halt
		99: lambda self: ICProgram.__setattr__(self, 'state', ICPState.FINISHED)
	}

	incs = {
		1: 4,
		2: 4,
		3: 2,
		4: 2,
		5: 3,
		6: 3,
		7: 4,
		8: 4,
		9: 2,
		99: 0
	}

	ps = {
		1: [0, 0, 1],
		2: [0, 0, 1],
		3: [1],
		4: [0],
		5: [0, 0],
		6: [0, 0],
		7: [0, 0, 1],
		8: [0, 0, 1],
		9: [0],
		99: []
	}
	
	def __init__(self):
		self.program = []
		self.memory = []
		self.ip = -1
		self.relBase = -1
		self.inputBuffer = Queue()
		self.outputBuffer = Queue()
		self.state = ICPState.OFF
		self.thread = None

	def loadProgram(self, memoryMap):
		if(self.state is ICPState.OFF or self.state is ICPState.FINISHED):
			if(memoryMap is not None):
				if(type(memoryMap) is list):
					self.program = [int(c) for c in memoryMap]
					self.stop()
					return True
		return False

	def feedInput(self, value):
		try:
			self.inputBuffer.put(int(value))
		except TypeError:
			return False
		return True
	
	def getOutput(self, blocking=True):
		try:
			return self.outputBuffer.get(blocking)
		except:
			return None

	def start(self):
		self.state = ICPState.RUNNING
		self.thread.start()

	def stop(self):
		if(self.thread is not None and self.thread.is_alive()):
			self.thread.do_run = False
			# self.thread.join()
		self.__reset__()

	def isRunning(self):
		return self.state is ICPState.RUNNING or self.state is ICPState.WAITING

	def isFinished(self):
		return self.state == ICPState.FINISHED

	def waitForOutput(self):
		return self.isRunning() or self.outputBuffer.qsize() > 0

	def __run__(self):
		while(self.state is ICPState.RUNNING):
			args = self.__fetch__()
			opcode, *args = self.__decode__(*args)
			self.__execute__(opcode, *args)

	def __fetch__(self):
		return tuple(self.memory[self.ip:self.ip+4])

	def __decode__(self, *args):
		opcode = args[0] % 100
		ret = [opcode]

		for i in range(ICProgram.incs[opcode] - 1):
			v = args[i + 1]
			p = ICProgram.ps[opcode][i]
			m = (args[0] // 10 ** (2 + i)) % 10

			if(m == 2):
				v += self.relBase
			
			if(m != 1 and p != 0):
				self.__fitMemory__(v)
			if(m == 1 or p == 1):
				ret.append(v)
			else:
				try:
					ret.append(self.memory[v])
				except IndexError:
					self.__fitMemory__(v)
					ret.append(self.memory[v])

		self.ip += ICProgram.incs[opcode]

		return tuple(ret)
	
	def __execute__(self, opcode, *args):
		self.state = ICPState.WAITING
		ICProgram.ops[opcode](self, *args)
		if(self.state is not ICPState.FINISHED):
			self.state = ICPState.RUNNING

	def __reset__(self):
		self.memory = self.program.copy()
		self.ip = 0
		self.relBase = 0
		self.state = ICPState.HALTED
		with self.inputBuffer.mutex:
			self.inputBuffer.queue.clear()
		with self.outputBuffer.mutex:
			self.outputBuffer.queue.clear()
		self.thread = Thread(target=self.__run__)
		self.thread.daemon = True

	def __fitMemory__(self, index):
		if(index < 0):
			raise IndexError('Trying to access location {}'.format(index))
		try:
			_ = self.memory[index]
		except IndexError:
			self.memory.extend([0 for _ in range(index - len(self.memory) + 1)])
