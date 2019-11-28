#! perl
# https://adventofcode.com/2018/day/9
use strict;
use warnings;
use List::Util qw(max);
use List::DoubleLinked;

my $line = <>;
my ($nPlayers, $maxMarble) = $line =~ /\b(\d+)\b/g;
$maxMarble *= 100;
my $circle = List::DoubleLinked->new(0, 1);
my $currentMarble = $circle->end;
my $nMarbles = 2;
my $position = 1;
my @points = (0) x $nPlayers;

for(2..$maxMarble) {
    if($_ % 23 == 0) {
        my $arrivingIndex = $currentMarble->previous->previous->previous->previous->previous->previous->previous;
        my $removed = $arrivingIndex->get;
        $currentMarble = $circle->erase($arrivingIndex);
        my $player = $_ % $nPlayers + 1;
        $points[$player] += $_ + $removed;
        $nMarbles--;
    } else {
        $position += 2;
        if($position >= $nMarbles) {
            $position = $position % $nMarbles;
            $currentMarble = $circle->begin;
            for(0..$position-1) {
                $currentMarble = $currentMarble->next;
            }
        } else {
            $currentMarble = $currentMarble->next;
        }
        $currentMarble->insert_after($_);
        $currentMarble = $currentMarble->next;
        $nMarbles++;
    }
}

print max @points;