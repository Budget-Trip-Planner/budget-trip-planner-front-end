#!/bin/sh

if [ ! -f package.json ]; then
    echo "Initialisation du projet Angular..."
    ng new frontend --skip-git --directory ./ --routing --style=css
    ng analytics off
fi


npm install

# Lancement du serveur
ng serve --host 0.0.0.0 --poll 2000
