#! perl
# http://adventofcode.com/2018/day/6

use strict;
use warnings;
use List::Util qw(max min);

my @xs;
my @ys;

sub getClosest {
    my($x, $y) = @_;
    my $recordDist = 9**9**9;
    my @closest = ();
    foreach my $i (0..$#xs) {
        my $dist = abs($x - $xs[$i]) + abs($y - $ys[$i]);
        if($dist == $recordDist) {
            push @closest, ($i);
        } elsif($dist < $recordDist) {
            $recordDist = $dist;
            @closest = ($i);
        }
    }
    @closest;
}

foreach (<>) {
    my ($x) = m/(\d+),/;
    my ($y) = m/, (\d+)/;
    push @xs, ($x);
    push @ys, ($y);
}

my $xmin = min @xs;
my $xmax = max @xs;
my $ymin = min @ys;
my $ymax = max @ys;

my @indexes = (0) x @xs;
my @edge = (0) x @xs;

foreach my $i ($xmin..$xmax) {
    foreach my $j ($ymin..$ymax) {
        my ($x, $y) = ($i, $j);
        my @closest = &getClosest($x, $y);
        next if @closest > 1;
        # my $dist = abs($x - $xs[$closest[0]]) + abs($y - $ys[$closest[0]]);
        if($x <= $xmin || $x >= $xmax || $y <= $ymin || $y >= $ymax) {
            $edge[$closest[0]] = 1;
        }
        $indexes[$closest[0]]++;
    }
}

@indexes = map $edge[$_] ? () : $indexes[$_], 0..$#indexes;
print max @indexes; # 4475