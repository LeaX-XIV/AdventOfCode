#! perl
# https://adventofcode.com/2018/day/7
use strict;
use warnings;

my @interval = 'A'..'Z';
my (%prec, %succ);

for (@interval) {
    @prec{$_} = ();
    @succ{$_} = ();
}

while(<>) {
    my ($before, $after) = m/\b([A-Z])\b/g;
    push @{$succ{$before}}, ($after);
    push @{$prec{$after}}, ($before);
}

my @start = (grep !defined $prec{$_}, @interval);
my @end = (grep(!defined $succ{$_}, @interval));
my @ready = ();
my @visited = ();
push @ready, @start;

while(scalar @ready > 0) {
    @ready = sort @ready;
    my $now = shift @ready;
    my %visited = map{$_ => 1} @visited;
    while(grep(!defined $visited{$_}, @{$prec{$now}}) > 0) {
        $now = shift @ready;
    }
    push @visited, ($now);
    unless($now eq $end[0]) {
        push @ready, @{$succ{$now}};
    }
    %visited = map{$_ => 1} @visited;
    @ready = grep(!defined $visited{$_}, @ready);

}

print @visited; # GJKLDFNPTMQXIYHUVREOZSAWCB
