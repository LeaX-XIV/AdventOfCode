#! perl
# http://adventofcode.com/2018/day/3

use strict;
use warnings;

my @fabric;
my @maybeOk;
my @nope;

sub uniq {
    my %seen;
    grep !$seen{$_}++, @_;
}

while(<>) {
    my ($id, $x, $y, $w, $h) = m/(\d+)/g;
    push @maybeOk, $id;

    foreach my $i (0..$w-1) {
        foreach my $j (0..$h-1) {
            if(defined($fabric[$x+$i][$y+$j])) {
                if($fabric[$x+$i][$y+$j] ne 'X') {
                    push @nope, ($fabric[$x+$i][$y+$j], $id);
                    $fabric[$x+$i][$y+$j] = 'X';
                } else {
                    push @nope, $id;
                }
            } else {
                $fabric[$x+$i][$y+$j] = $id;
            }
        }
    }
}
# Performing set difference
@nope = uniq(@nope);
my %in_nope = map {$_ => 1} @nope;
my @diff = grep {not $in_nope{$_}} @maybeOk;

print "@diff\n";    # 412