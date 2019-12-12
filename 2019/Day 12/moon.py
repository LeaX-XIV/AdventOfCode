class Moon:

	def __init__(self, x, y, z):
		self.pos = [int(x), int(y), int(z)]
		self.vel = [0, 0, 0]
		self.acc = [0, 0, 0]

	def applyGravity(self, moon):
		for i in range(len(self.acc)):
			self.acc[i] += 1 if self.pos[i] < moon.pos[i] \
					else -1 if self.pos[i] > moon.pos[i] \
					else 0

	def applyAcceleration(self):
		for i in range(len(self.vel)):
			self.vel[i] += self.acc[i]

	def applyVelocity(self):
		for i in range(len(self.pos)):
			self.pos[i] += self.vel[i]

	def update(self):
		self.applyAcceleration()
		self.applyVelocity()
		self.acc = [0, 0, 0]

	def kinEnergy(self):
		return sum(abs(vi) for vi in self.vel)

	def potEnergy(self):
		return sum(abs(vi) for vi in self.pos)

	def totEnergy(self):
		return self.kinEnergy() * self.potEnergy()