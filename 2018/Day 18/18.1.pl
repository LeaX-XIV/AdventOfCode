#! perl
# http://adventofcode.com/2018/day/18
use strict;
use warnings;
use List::Flatten;
use Storable qw(dclone);

sub neighbours {
	# no warnings 'uninitialized';
	my ($x, $y, $c, @grid) = @_;

	return scalar grep {defined $_ && $_ eq $c} ($y-1 < 0 ? undef : $x-1 < 0 ? undef : $grid[$y-1][$x-1], $y-1 < 0 ? undef : $grid[$y-1][$x], $y-1 < 0 ? undef : $x+1 > $#{$grid[$y]} ? undef : $grid[$y-1][$x+1],
	$x-1 < 0 ? undef : $grid[$y][$x-1], $x+1 > $#{$grid[$y]} ? undef : $grid[$y][$x+1],
	$x-1 < 0 ? undef : $y+1 > $#grid ? undef : $grid[$y+1][$x-1], $y+1 > $#grid ? undef : $grid[$y+1][$x], $y+1 > $#grid ? undef : $x+1 > $#{$grid[$y]} ? undef : $grid[$y+1][$x+1]);
}

chomp (my @lines = <>);
my @acres;
my @acresCopy;

for(@lines) {
	push @acres, [ split '', $_ ];
}

for(1..10) {
	for my $y (0..$#acres) {
		for my $x (0..$#{$acres[$y]}) {
			my $acre = $acres[$y][$x];
			$acresCopy[$y][$x] =
			$acre eq '.' && &neighbours($x, $y, '|', @acres) >= 3 ?
				'|'
			: $acre eq '|' && &neighbours($x, $y, '#', @acres) >= 3 ?
				'#'
			: $acre eq '#' && (&neighbours($x, $y, '#', @acres) == 0
			|| &neighbours($x, $y, '|', @acres) == 0) ?
				'.'
			: $acre;
		}
	}
	@acres = @{dclone(\@acresCopy)};
}

my $trees = grep {$_ eq '|'} split('', join '', flat @acres);
my $lumbs = grep {$_ eq '#'} split('', join '', flat @acres);

print $trees * $lumbs;	# 620624