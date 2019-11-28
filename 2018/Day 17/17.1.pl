#! perl
# http://adventofcode.com/2018/day/17
use strict;
use warnings;
use List::Util qw/max min reduce/;
use GD::Simple;
use Data::Dumper;


sub savePNG {
	my ($path, @grid) = @_;
	my $img = GD::Simple->new(scalar @{$grid[1]}, scalar @grid);

	$img->bgcolor('yellow');
	$img->fgcolor('yellow');
	$img->rectangle(0, 0, scalar @{$grid[1]}, scalar @grid);
	for my $i(0..$#grid) {
		for my $j(0..$#{$grid[$i]}) {
			my $c = $grid[$i][$j];
			if(defined $c) {
				if($c eq '#') {
					$img->bgcolor('black');
					$img->fgcolor('black');
				} elsif($c eq 'A') {
					$img->bgcolor('cyan');
					$img->fgcolor('cyan');
				} elsif($c eq 'a') {
					$img->bgcolor('blue');
					$img->fgcolor('blue');
				}
				$img->rectangle($j, $i, $j, $i);
			}
		}
	}

	$img->bgcolor('red');
	$img->fgcolor('red');
	$img->rectangle(500, 0, 500, 0);

	open my $out, '>', $path or die "cant open file";
	binmode $out;
	print $out $img->png;
	print "$path saved\n";
	close $out;
}


chomp (my @lines = <>);
my @xs = ();
my @ys = ();

for(@lines) {
	push @xs, grep defined, m/(?<=x=)(\d+)(?:(?:\.\.)(\d+))?/g;
	push @ys, grep defined, m/(?<=y=)(\d+)(?:(?:\.\.)(\d+))?/g;
}

@xs = sort { $a <=> $b } @xs;
@ys = sort { $a <=> $b } @ys;
my ($xmin, $xmax, $ymin, $ymax) = ($xs[0], $xs[-1], $ys[0], $ys[-1]);
my @grid;
$#grid = $ymax-1;
for(@grid) {
	my @row;
	$#row = $xmax - 1;
	$_ = \@row;
}

for(@lines) {
	my @x = grep defined, m/(?<=x=)(\d+)(?:(?:\.\.)(\d+))?/g;
	my @y = grep defined, m/(?<=y=)(\d+)(?:(?:\.\.)(\d+))?/g;

	if(@x == 2) {
		for($x[0]..$x[1]) {
			# print "Clay in $_, $y[0]\n";
			$grid[$y[0]][$_] = '#';
		}
	} elsif(@y == 2) {
		for($y[0]..$y[1]) {
			# print "Clay in $x[0], $_\n";
			$grid[$_][$x[0]] = '#';
		}
	} else {
		print "Error: @x\t@y\n";
	}

	# &savePNG($_ . '.png', @grid);
}

# &savePNG('start.png', @grid);

# Grid created
# Clay is #
# Sand is undef
# Settled water is a
# Unsettled water is A



sub drop {
	no warnings 'recursion';
	my ($x, $y, $from, @grid) = @_;
	my $d = 0;
	if(!defined $grid[$y][$x] && $y > $ymax) {
		return 0;
	}
	if(&isStable($x, $y, 0, @grid)) {
		return 0;
	}
	# if(!defined $grid[$y][$x] && $y <= $ymax) {
		$grid[$y][$x] = 'A';

		$d = &drop($x, $y+1, 0, @grid) +
		($from != +1 && &isStable($x, $y+1, 0, @grid) ? 0 : &drop($x-1, $y, -1, @grid)) +
		($from != -1 && &isStable($x, $y+1, 0, @grid) ? 0 : &drop($x+1, $y, +1, @grid)) + 1;
		&isStableR($x, $y, 0, @grid);
	# }


	# my $d = 0;
	# $d += &drop($x, $y+1, 0, @grid);
	# if($from == 0 && &isStable($x, $y+1, 0, @grid)) {
	# 	#save to restart here
	# }
	# if($from != +1 && &isStable($x, $y+1, 0, @grid)){
	# 	$d += &drop($x-1, $y, -1, @grid);
	# }
	# if($from != -1 && &isStable($x, $y+1, 0, @grid)){
	# 	$d += &drop($x+1, $y, +1, @grid);
	# }

	return $d;
}

sub isStable {
	my ($x, $y, $from, @grid) = @_;
	my $c = $grid[$y][$x];

	if(!defined $c) {
		return 0;
	}
	if($c eq '#' || $c eq 'a') {
		return 1;
	}
	return 0;
}

sub isStableR {
	no warnings 'recursion';
	my ($x, $y, $from, @grid) = @_;
	my $c = $grid[$y][$x];

	if(!defined $c) {
		return 0;
	}
	if($c eq '#' || $c eq 'a') {
		return 1;
	}

	if(&isStable($x, $y+1, 0, @grid) &&
	($from == +1 ? 1 : &isStableR($x-1, $y, -1, @grid)) &&
	($from == -1 ? 1 : &isStableR($x+1, $y, +1, @grid))) {
		$grid[$y][$x] = 'a';
		return 1;
	}

	return 0;


# 	my $down = &isStable($x, $y+1, 0, @grid);
# 	my $left = $from == +1 ? 1 : &isStable($x-1, $y, -1, @grid);
# 	my $right = $from == -1 ? 1 : &isStable($x+1, $y, +1, @grid);
# 	if($down && $left && $right) {
# 		$grid[$y][$x] = 'a';
# 	}

# 	return $down && $left && $right;
}

@xs = ();
@ys = ();
my $water = 0;
my $pwater = -1;

while($water > $pwater) {

	$pwater = $water;
	$water += &drop(500, 0, 0, @grid);

	# for (reverse 0..$#xs) {
	# 	my ($x, $y) = ($xs[$_], $ys[$_]);
	# 	if(isStableR($x, $y, 0, @grid)) {
	# 		# $grid[$y][$x] = 'a';
	# 		splice @xs, $_, 1;
	# 		splice @ys, $_, 1;
	# 	}
	# }

	print "$water\n";
	# print "@xs\n";
	# print "@ys\n";
	# print "\n";
	&savePNG($water . '.png', @grid) if($water % 60 == 0);
}

&savePNG('fin.png', @grid);

my $inside = 0;
for my $j ($ymin..$ymax) {
	for my $i ($xmin..$xmax) {
		if(defined $grid[$j][$i] && ($grid[$j][$i] eq 'a' || $grid[$j][$i] eq 'A')) {
			$inside++;
		}
	}
}

print $inside;
