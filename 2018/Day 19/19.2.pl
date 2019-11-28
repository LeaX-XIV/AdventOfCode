#! perl
# http://adventofcode.com/2018/day/19
use strict;
use warnings;

chomp (my ($pc) = <> =~ /(\d+)/);
chomp (my @lines = <>);

# Good ol' bruteforce
my @registers = (1, (0) x 5);
my %opcodes = (
	'addr' => sub {$registers[$_[2]] = $registers[$_[0]] + $registers[$_[1]]},
	'addi' => sub {$registers[$_[2]] = $registers[$_[0]] + $_[1]},
	'mulr' => sub {$registers[$_[2]] = $registers[$_[0]] * $registers[$_[1]]},
	'muli' => sub {$registers[$_[2]] = $registers[$_[0]] * $_[1]},
	'banr' => sub {$registers[$_[2]] = $registers[$_[0]] & $registers[$_[1]]},
	'bani' => sub {$registers[$_[2]] = $registers[$_[0]] & $_[1]},
	'borr' => sub {$registers[$_[2]] = $registers[$_[0]] | $registers[$_[1]]},
	'bori' => sub {$registers[$_[2]] = $registers[$_[0]] | $_[1]},
	'setr' => sub {$registers[$_[2]] = $registers[$_[0]]},
	'seti' => sub {$registers[$_[2]] = $_[0]},
	'gtir' => sub {$registers[$_[2]] = $_[0] > $registers[$_[1]] ? 1 : 0;},
	'gtri' => sub {$registers[$_[2]] = $registers[$_[0]] > $_[1] ? 1 : 0;},
	'gtrr' => sub {$registers[$_[2]] = $registers[$_[0]] > $registers[$_[1]] ? 1 : 0;},
	'eqir' => sub {$registers[$_[2]] = $_[0] == $registers[$_[1]] ? 1 : 0;},
	'eqri' => sub {$registers[$_[2]] = $registers[$_[0]] == $_[1] ? 1 : 0;},
	'eqrr' => sub {$registers[$_[2]] = $registers[$_[0]] == $registers[$_[1]] ? 1 : 0;}
);

while($registers[$pc] <= $#lines) {
	my ($opCode, $a, $b, $c) = $lines[$registers[$pc]] =~ /(\w+)(?:\W*(\d+)+)/gi;
	$opcodes{$opCode}->($a, $b, $c);
	$registers[$pc]++;
}
print "$registers[0]\n";	# 2016