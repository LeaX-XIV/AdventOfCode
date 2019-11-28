#! perl
# http://adventofcode.com/2018/day/16
use v5.12.0;
use strict;
use warnings;

my @registers = ();

sub addr {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] + $registers[$b];
}

sub addi {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] + $b;
}

sub mulr {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] * $registers[$b];
}

sub muli {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] * $b;
}

sub banr {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] & $registers[$b];
}

sub bani {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] & $b;
}

sub borr {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] | $registers[$b];
}

sub bori {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] | $b;
}

sub setr {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a];
}

sub seti {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $a;
}

sub gtir {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $a > $registers[$b] ? 1 : 0;
}

sub gtri {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] > $b ? 1 : 0;
}

sub gtrr {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] > $registers[$b] ? 1 : 0;
}

sub eqir {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $a == $registers[$b] ? 1 : 0;
}

sub eqri {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] == $b ? 1 : 0;
}

sub eqrr {
    my ($opcode, $a, $b, $c) = @_;
    $registers[$c] = $registers[$a] == $registers[$b] ? 1 : 0;
}

$/ = "\n\n";
chomp (my @lines = <>);
my @operations = (\&addr, \&addi, \&mulr, \&muli, \&banr, \&bani, \&borr, \&bori, \&setr, \&seti, \&gtir, \&gtri, \&gtrr, \&eqir, \&eqri, \&eqrr);
my $atLeast3 = 0;

for(@lines) {
    if(length $_ > 0) {
        my @sample = split "\n", $_;
        my @regsBefore = $sample[0] =~ /\d+/g;
        my @instruction = $sample[1] =~ /\d+/g;
        my @regsAfter = $sample[2] =~ /\d+/g;
        my $nBehaviours = 0;
        for(0..$#operations) {
            @registers = @regsBefore;
            $operations[$_]->(@instruction);
            $nBehaviours++ if(join("", @registers) eq join("", @regsAfter));
        }
        $atLeast3++ if $nBehaviours >= 3;
    } else {
        last;
    }
}

print "$atLeast3\n";    # 642