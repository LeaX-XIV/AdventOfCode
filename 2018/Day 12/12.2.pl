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
my $zeroPos = 5;
my $sumPots = 0;
my $pSumPots = 0;

for (@lines) {
    if(/=> #/) {
        $producePlant{substr($_, 0, 5)} = 1;
    } elsif(/=> ./) {
        $noProducePlant{substr($_, 0, 5)} = 1;
    }
}

$state1 =~ s/initial state: //gi;
$state1 = ("." x 5) . $state1 . ("." x 5);

my @state1 = split //, $state1;
my @state2 = ();

while($generation < 1000) {
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

    while($state1[-1] eq ".") {
        pop @state1;
    }
    while($state1[0] eq ".") {
        shift @state1;
        $zeroPos--;
    }

    push @state1, (".") x 5;
    unshift @state1, (".") x 5;
    $zeroPos += 5;

    my @pots = (map {$state1[$_] eq '.' ? 0 : $_ - $zeroPos} 0..$#state1);
    $pSumPots = $sumPots;
    $sumPots = sum @pots;
}


print ($sumPots + ($sumPots - $pSumPots) * (50_000_000_000 - $generation));    # 3100000000655
