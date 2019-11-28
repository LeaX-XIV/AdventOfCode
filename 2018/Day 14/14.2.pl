#! perl
# http://adventofcode.com/2018/day/14
use strict;
use warnings;

chomp (my @lines = <>);
my $nRecipes = "$lines[0]";
my @scores = (3, 7, 1, 0);
my $str = join "", @scores;
my ($elf1, $elf2) = (0, 1);

until($str =~ /$nRecipes/) {
	my ($rec1, $rec2) = ($scores[$elf1], $scores[$elf2]);
	my $combined = $rec1 + $rec2;
	my ($new1, $new2) = (int($combined / 10), $combined % 10);
	if($new1 != 0) {
		push @scores, $new1;
		$str .= $new1;
	}
	push @scores, $new2;
	$str .= $new2;

	if(length $str > 10) {
		$str = substr $str, -10;
	}
	$elf1 = ($elf1 + 1 + $rec1) % @scores;
	$elf2 = ($elf2 + 1 + $rec2) % @scores;

}

print index(join("", @scores), $nRecipes);	# 20227889