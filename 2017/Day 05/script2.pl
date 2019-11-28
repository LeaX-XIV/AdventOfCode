#! perl

# --- Part Two ---
# Now, the jumps are even stranger: after each jump, if the offset was three or more, instead decrease it by 1. Otherwise, increase it by 1 as before.

# Using this rule with the above example, the process now takes 10 steps, and the offset values after finding the exit are left as 2 3 2 3 -1.

# How many steps does it now take to reach the exit?

use strict;
use warnings;

chomp (my @offsets = <>);
my $current = 0;
my $increment = 1;
my $value = 0;
my $jumps = 0;

while($current < @offsets) {
	$value = $offsets[$current];
	if($value >= 3) {
		$offsets[$current] -= $increment;
	} else {
		$offsets[$current] += $increment;
	}
	$current += $value;
	$jumps++;
}

print $jumps, "\n";

# Your puzzle answer was 26889114.