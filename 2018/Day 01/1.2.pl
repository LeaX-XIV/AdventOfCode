#! perl
# http://adventofcode.com/2018/day/1

chomp(@lines = <>);
$totFreq = 0;
%found;

while(1) {
    foreach $freq (@lines) {
        $totFreq += $freq;

        if(exists $found{$totFreq}) {
            print $totFreq; # 73272
            exit;
        } else {
            $found{$totFreq} = 1;
        }
    }
}