#! perl

# --- Part Two ---
# For added security, yet another system policy has been put in place. Now, a valid passphrase must contain no two words that are anagrams of each other - that is, a passphrase is invalid if any word's letters can be rearranged to form any other word in the passphrase.

# For example:

# abcde fghij is a valid passphrase.
# abcde xyz ecdab is not valid - the letters from the third word can be rearranged to form the first word.
# a ab abc abd abf abj is a valid passphrase, because all letters need to be used when forming another word.
# iiii oiii ooii oooi oooo is valid.
# oiii ioii iioi iiio is not valid - any of these words can be rearranged to form any other word.
# Under this new system policy, how many passphrases are valid?

use strict;
use warnings;

sub isAnagrammable {

	my $str1 = $_[0];
	my $str2 = $_[1];

	if(length ($str1) != length ($str2)) {
		return undef;
	}

	if($str1 eq $str2) {
		return 1;
	}

	my %letters;
	foreach(split //, $str1) {
		$letters{$_}++;
	}

	foreach(split //, $str2) {
		if(exists $letters{$_} && $letters{$_} > 0) {
			$letters{$_}--;
		} else {
			return undef;
		}
	}

	return 1;
}

chomp (my @lines = <>);
my $valid = 0;

foreach(@lines) {
	my @words = split / /, $_;

	my $ok = 1;
	for(my $i = 0; $i < @words; $i++) {
		for(my $j = $i + 1; $j < @words; $j++) {
			if(isAnagrammable($words[$i], $words[$j])) {
				$ok = undef;
				last;
			}
		}

		if(!$ok) {
			last;
		}
	}

	if($ok) {
		$valid++;
	}
}

print $valid, "\n";

# Your puzzle answer was 119.