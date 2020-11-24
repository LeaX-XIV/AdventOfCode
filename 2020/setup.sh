daynum=$1
if [ $daynum -lt 10 ]; then
	daynum="0"$daynum
fi

DIRNAME="Day "$daynum

echo "Preparing folder $DIRNAME..."

mkdir -p "$DIRNAME"

cp -R setup/* "$DIRNAME"

echo "cd in folder $DIRNAME..."

cd "$DIRNAME"