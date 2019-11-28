#! perl
# http://adventofcode.com/2018/day/12
use strict;
use warnings;
use List::Util qw/reduce sum/;

chomp (my $state1 = <>);
chomp (my @lines = <>);
my %producePlant = ();
my %noProducePlant = ();
my $generation = 0;

for (@lines) {
    if(/=> #/) {
        $producePlant{substr($_, 0, 5)} = 1;
    } elsif(/=> ./) {
        $noProducePlant{substr($_, 0, 5)} = 1;
    }
}

$state1 =~ s/initial state: //gi;
$state1 = ("." x 200) . $state1 . ("." x 200);

my @state1 = split //, $state1;
my @state2 = ();

while($generation < 20) {
    push @state2, (".", ".");
    for(2..$#state1 - 2) {
        my $current = join "", ($state1[$_-2], $state1[$_-1], $state1[$_], $state1[$_+1], $state1[$_+2]);
        if(defined $producePlant{$current}) {
            push @state2, "#";
        } elsif(defined $noProducePlant{$current}) {
            push @state2, ".";
        } else {
            die "Sequence " . $current . " not fount\n";
        }
    }
    push @state2, (".", ".");
    @state1 = @state2;
    @state2 = ();
    $generation++;
}

my @pots = (map {$state1[$_] eq '.' ? 0 : $_ - 200} 0..$#state1);
my $sumPots = sum @pots;
print "@state1\n";
print "$sumPots\n";