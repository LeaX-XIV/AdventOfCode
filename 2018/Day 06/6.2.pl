#! perl
# http://adventofcode.com/2018/day/6

use strict;
use warnings;
use List::Util qw(max min);

my @xs;
my @ys;

sub getDistSum {
    my($x, $y) = @_;
    my $totDist = 0;
    foreach my $i (0..$#xs) {
        $totDist += abs($x - $xs[$i] ) + abs($y - $ys[$i]);
    }
    $totDist;
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

my $maxDist = 10000;
my $regionSize = 0;
foreach my $i ($xmin..$xmax) {
    foreach my $j ($ymin..$ymax) {
        my ($x, $y) = ($i, $j);
        if(&getDistSum($x, $y) < $maxDist) {
            $regionSize++;
        }
    }
}

print $regionSize;  # 35237