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

sub uniq {
    my %seen;
    grep !$seen{$_}++, @_;
}

$/ = "\n\n";
chomp (my @lines = <>);
my @operations = (\&addr, \&addi, \&mulr, \&muli, \&banr, \&bani, \&borr, \&bori, \&setr, \&seti, \&gtir, \&gtri, \&gtrr, \&eqir, \&eqri, \&eqrr);
my @is;
my $i;

for($i = 0; ; $i++) {
    $_ = $lines[$i];
    if(length $_ > 0) {
        my @sample = split "\n", $_;
        my @regsBefore = $sample[0] =~ /\d+/g;
        my @instruction = $sample[1] =~ /\d+/g;
        my @regsAfter = $sample[2] =~ /\d+/g;
        my @behaviours = ();
        for(0..$#operations) {
            @registers = @regsBefore;
            $operations[$_]->(@instruction);
            if(join("", @registers) eq join("", @regsAfter)) {
                push @behaviours, $_;
            }
        }
        push @{$is[$instruction[0]]}, @behaviours;
    } else {
        last;
    }
}
# With this,
# for(0..15) {
#     @{$is[$_]} = &uniq(@{$is[$_]});
#     print "OpCode $_:\t@{$is[$_]}\n";
# }
# I know that
@is = (
    $operations[13],
    $operations[1],
    $operations[10],
    $operations[8],
    $operations[2],
    $operations[9],
    $operations[3],
    $operations[14],
    $operations[7],
    $operations[5],
    $operations[12],
    $operations[15],
    $operations[0],
    $operations[11],
    $operations[6],
    $operations[4]    
);
@registers = (0, 0, 0, 0);
$/ = "\n";
for(split "\n", $lines[$i+1]) {
    my @instruction = /\d+/g;
    $is[$instruction[0]]->(@instruction);
}

print $registers[0];    # 481
