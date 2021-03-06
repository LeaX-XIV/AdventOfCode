#! perl
# http://adventofcode.com/2018/day/4

use List::Util qw(first max  min reduce);

use 5.014;
use constant false => 0;
use constant true  => 1;

sub addMinute {
    my ($y, $M, $d, $h, $m) = @_;
    if($m++ >= 59) {
        $m = 0;
        if($h++ >= 23) {
            $h = 0;
            if($d++ >= 30) {
                $d = 0;
                $M++;
            }
        }
    }
    ($y, $M, $d, $h, $m);
}

my @lines = sort <>;

my $_id;
my ($_y, $_M, $_d, $_h, $_m);
my $_datetime;
my @a;
my $datetime;
my ($y, $M, $d, $h, $m);
my $id;
for (@lines) {
    ($datetime) = m/(?<=\[)(.+)(?=\])/i;
    ($y, $M, $d, $h, $m) = $datetime =~ m/(\d+)/gi;
    $datetime = join ' ', ($y, $M, $d, $h, $m);
    ($id) = m/(?<=\#)(\d+)/gi;    # Start turn
    my $asleep = m/(falls asleep)/ ? true : false; # Falls asleep
    my $woken = m/(wakes up)/ ? true : false;      # Wakes up

    if($woken) {
        while($_datetime lt $datetime) {
            ($_y, $_M, $_d, $_h, $_m) = $_datetime =~ m/(\d+)/gi;
            $a[$_id][$_m]++;
            $_datetime = join ' ', &addMinute(split /\s+/, $_datetime);
        }
    }

} continue {
    $_datetime = $datetime;
    ($_y, $_M, $_d, $_h, $_m) = ($y, $M, $d, $h, $m);
    if(defined $id) {
        $_id = $id;
    }
}
my %h = ();
my $idMax = -1;
foreach(my $i = 0; $i < scalar @a; $i++) {
    if(defined @a[$i]) {
        for (@{$a[$i]}) {
            $h{$i} += $_;
        }
    }
}

for(keys %h) {
    if($idMax < 0) {
        $idMax = $_;
    } elsif($h{$_} > $h{$idMax}) {
        $idMax = $_;
    }
}
my @chosenArr = @{$a[$idMax]};
my $maxSleep = reduce {$a > $b ? $a : $b} @chosenArr;
my $bestMin = first {$chosenArr[$_] == $maxSleep} 0..$#chosenArr;

print $idMax * $bestMin . "\n"; # 50558