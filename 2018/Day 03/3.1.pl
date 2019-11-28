#! perl
# http://adventofcode.com/2018/day/3

use strict;
use warnings;

my @fabric;
my $overlapping = 0;

while(<>) {
    my ($id, $x, $y, $w, $h) = m/(\d+)/g;
    foreach my $i (0..$w-1) {	# Today I learnt something
        foreach my $j (0..$h-1) {	# Today I learnt something
            if(defined($fabric[$x+$i][$y+$j])) {
                if($fabric[$x+$i][$y+$j] ne 'X') {
                    $fabric[$x+$i][$y+$j] = 'X';
                    $overlapping++;
                }
            } else {
                $fabric[$x+$i][$y+$j] = $id;
            }
        }
    }
}

print $overlapping;	# 118223