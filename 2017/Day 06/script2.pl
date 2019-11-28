#! perl

# --- Part Two ---
# Out of curiosity, the debugger would also like to know the size of the loop: starting from a state that has already been seen, how many block redistribution cycles must be performed before that same state is seen again?

# In the example above, 2 4 1 2 is seen again after four cycles, and so the answer in that example would be 4.

# How many cycles are in the infinite loop that arises from the configuration in your puzzle input?

use strict;
use warnings;

sub findMaxIndex {
	my @list = @_;

	my $currentMax = $list[0];
	my $currentIndex = 0;
	for(my $i = 1; $i < @list; $i++) {
		if($list[$i] > $currentMax) {
			$currentMax = $list[$i];
			$currentIndex = $i;
		}
	}

	return $currentIndex;
}

sub elementwise_eq {
    my ($xref, $yref) = @_;
    if(@$xref != @$yref) {
    	return 0;
    }

    for(my $i = 0; $i < @$xref; $i++) {
#    	print "$$xref[$i] : $$yref[$i] ", ($$xref[$i] == $$yref[$i]), "\n";
    	if($$xref[$i] != $$yref[$i]) {
    		return 0;
    	}
    }

    return 1;
}

chomp (my $inputLine = <>);
my @banks = split /\t/, $inputLine;
my @history = ();
my $cycles = 0;

while(1) {
	for(my $i = 0; $i < @history; $i++) {
#		print "@$_ : @banks ", elementwise_eq($_, \@banks), "\n";
		if(elementwise_eq($history[$i], \@banks)) {
			print "$cycles - $i = ", $cycles - $i;
			goto FIN;
		}
	}
	my @dummy = @banks;
	push @history, \@dummy;
	my $maxIndex = findMaxIndex @banks;
	my $blocks = $banks[$maxIndex];
	$banks[$maxIndex] = 0;
	while($blocks > 0) {
		$maxIndex = ($maxIndex + 1) % @banks;
		$banks[$maxIndex]++;
		$blocks--;
	}
	$cycles++;
#	print "-----------------------------------\n";
}
FIN:
print "\n";

# Your puzzle answer was 2392.