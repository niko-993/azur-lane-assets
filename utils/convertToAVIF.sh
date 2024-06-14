# Pre requisite: imagemagick installed

# Default quality is 75

for f in *.png; do 
  convert "$f" -quality 75 "${f%.*}.avif"
done