#! perl
# https://adventofcode.com/2018/day/11
use strict;
use warnings;
use List::Util qw(min max);

chomp (my $gridSN = <>);
my @powerLevels = (()) x 300;

for my $x (1..300) {
    for my $y (1..300) {
        my $rackID = $x + 10;
        my $powerLevel = $rackID * ($rackID * $y + $gridSN);
        $powerLevel = int(($powerLevel % 1000) / 100) - 5;
        $powerLevels[$x][$y] = $powerLevel;
    }
}

my $bestPower = -9**9**9;
my $bestX = -1;
my $bestY = -1;
my $bestSize = 0;
for my $x (1..300) {
    for my $y (1..300) {
        my $attempt = 0;
        for my $size (1..301-max($x, $y)) {
            for my $d (0..$size-2) {
                $attempt += $powerLevels[$x+$d][$y+$size-1];
                $attempt += $powerLevels[$x+$size-1][$y+$d];
            }
            $attempt += $powerLevels[$x+$size-1][$y+$size-1];

            if($attempt > $bestPower) {
                $bestPower = $attempt;
                $bestX = $x;
                $bestY = $y;
                $bestSize = $size;
            }
        }
    }
}

print "$bestX,$bestY,$bestSize\n";	# 236,270,11