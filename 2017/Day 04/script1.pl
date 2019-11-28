#! perl

# --- Millisecond 4: High-Entropy Passphrases ---
# A new system policy has been put in place that requires all accounts to use a passphrase instead of simply a password. A passphrase consists of a series of words (lowercase letters) separated by spaces.

# To ensure security, a valid passphrase must contain no duplicate words.

# For example:

# aa bb cc dd ee is valid.
# aa bb cc dd aa is not valid - the word aa appears more than once.
# aa bb cc dd aaa is valid - aa and aaa count as different words.
# The system's full passphrase list is available as your puzzle input. How many passphrases are valid?

use strict;
use warnings;

my $valid = 0;

chomp (my @lines = <>);

foreach(@lines) {
	my %hash = ();
	my $ok = 1;

	foreach(split / /, $_) {
		if(!exists $hash{$_}) {
			$hash{$_} = 1;
		} else {
			$ok = undef;
			last;
		}
	}

	if($ok) {
		$valid++;
	}
}

print $valid, "\n";

# Your puzzle answer was 325.