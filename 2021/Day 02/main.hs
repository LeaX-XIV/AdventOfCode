-- https://adventofcode.com/2021/day/2
import           System.IO   (readFile)
import           Text.Printf (printf)

type Point = (Int, Int)

initPoint :: Point
initPoint = (0, 0)

type DirPoint = (Int, Int, Int)

initDirPoint :: DirPoint
initDirPoint = (0, 0, 0)

data Dir = Forward Int | Down Int | Up Int

parseDir :: String -> Dir
parseDir s =
    case d of
        "forward" -> Forward v
        "down"    -> Down v
        "up"      -> Up v
        _         -> error $ "Unrecognized direction " ++ d
    where [d, val] = words s
          v = read val :: Int

applyDirection :: Point -> Dir -> Point
applyDirection (x, y) (Forward v) = (x + v, y    )
applyDirection (x, y) (Down v)    = (x,     y + v)
applyDirection (x, y) (Up v)      = (x,     y - v)

applyDirection2 :: DirPoint -> Dir -> DirPoint
applyDirection2 (x, y, aim) (Forward v) = (x + v, y + v * aim, aim    )
applyDirection2 (x, y, aim) (Down v)    = (x,     y,           aim + v)
applyDirection2 (x, y, aim) (Up v)      = (x,     y,           aim - v)

calcSolution :: Point -> Int
calcSolution (x, y) = x * y

calcSolution2 :: DirPoint -> Int
calcSolution2 (x, y, aim) = x * y

main :: IO ()
main = do
    directions <- map parseDir . lines <$> readFile "./input.txt"

    printf "Part 1: %d\n" $ calcSolution  $ foldl applyDirection  initPoint    directions
    printf "Part 2: %d\n" $ calcSolution2 $ foldl applyDirection2 initDirPoint directions
