#! perl
# https://adventofcode.com/2018/day/7
use strict;
use warnings;

my @interval = 'A'..'Z';
my (%prec, %succ);
my %completeTime = ();

for (@interval) {
    @prec{$_} = ();
    @succ{$_} = ();
    $completeTime{$_} = ord($_) - ord('A') + 1 + 60;
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

my $nWorkers = 5;
my @workerCurrent = (undef) x $nWorkers;
my $seconds = 0;


WORK: while(1) {
    foreach (0..$#workerCurrent) {
        if(defined $workerCurrent[$_]) {
            $completeTime{$workerCurrent[$_]}--;
            if($completeTime{$workerCurrent[$_]} == 0) {
                my $finished = $workerCurrent[$_];
                $workerCurrent[$_] = undef;
                if($finished eq $end[0]) {
                    last WORK;
                } else {
                    push @ready, @{$succ{$finished}};
                    push @visited, ($finished);
                }
                my %visited = map{$_ => 1} @visited;
                @ready = grep(!defined $visited{$_}, @ready);
            }
        }
    }

    foreach (0..$#workerCurrent) {
        if(!defined $workerCurrent[$_]) {
            @ready = sort @ready;
            my $now = shift @ready // next;
            my %visited = map{$_ => 1} @visited;
            while(grep(!defined $visited{$_}, @{$prec{$now}}) > 0) {
                # Warning
                # Use of uninitialized value $now in hash element at 7.2.pl line 62, <> line 101.
                $now = shift @ready // undef;
            }
            
            $workerCurrent[$_] = $now;
        }
    }

    $seconds++;
}

print $seconds; # 967
