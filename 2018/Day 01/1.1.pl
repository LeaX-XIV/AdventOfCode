#! perl
# http://adventofcode.com/2018/day/1

$sum = 0;
while(<>) {
    chomp;
    $sum += $_;
}

print($sum) # 533