#! perl
# https://adventofcode.com/2018/day/11
use strict;
use warnings;

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
for my $x (1..300-2) {
    for my $y (1..300-2) {
        my $attempt = $powerLevels[$x][$y] +
                        $powerLevels[$x][$y+1] +
                        $powerLevels[$x][$y+2] +
                        $powerLevels[$x+1][$y] +
                        $powerLevels[$x+1][$y+1] +
                        $powerLevels[$x+1][$y+2] +
                        $powerLevels[$x+2][$y] +
                        $powerLevels[$x+2][$y+1] +
                        $powerLevels[$x+2][$y+2];

        if($attempt > $bestPower) {
            $bestPower = $attempt;
            $bestX = $x;
            $bestY = $y;
        }
    }
}

print "$bestX,$bestY\n";    # 20,41