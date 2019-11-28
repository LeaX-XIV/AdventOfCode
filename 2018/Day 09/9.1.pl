#! perl
# https://adventofcode.com/2018/day/9
use strict;
use warnings;
use List::Util qw(max);

my $line = <>;
my ($nPlayers, $maxMarble) = $line =~ /\b(\d+)\b/g;
my @circle = (0, 1);
my $currentMarble = 1;
my @points = (0) x $nPlayers;

for(2..$maxMarble) {
    if($_ % 23 == 0) {
        my $arrivingIndex = $currentMarble - 7;
        my $removed = splice @circle, $arrivingIndex, 1;
        my $player = $_ % $nPlayers + 1;
        $points[$player] += $_ + $removed;
        $currentMarble = $arrivingIndex;
    } else {
        my $arrivingIndex = ($currentMarble + 2) % @circle;
        splice @circle, $arrivingIndex, 0, ($_);
        $currentMarble = $arrivingIndex;
    }
}

print max @points;  # 388024