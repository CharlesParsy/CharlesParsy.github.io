<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Accueil</title>
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>

<?php require_once("templates/header.html"); ?>

<h1>Accueil</h1>

<img class="piece" src="ARMpiece.png" alt="img ARM">

<div class="bulle">
    <p class="txt">L'ARM Haulchin est une association qui met à disposition un local de répétition et du materiel musical.</p>
</div>

<div class="black">
    <h2>Notre histoire</h2>
    <p class="txt">L'Association de Répétition Musicale d'Haulchin est née en 2020 de l'idée de donner aux groupes locaux
        un lieu de répétition équipé de sorte à ne pas avoir à promener le materiel. Aujourd'hui, elle permet à 10 groupes
        de répéter chaque semaine.
    </p>
    <p class="txt">En plus de cela, elle leur permet de jouer lors de nos évènements.
    </p>
    <a class="bouton" href="events.php">En savoir plus sur nos événements</a>
</div>

<!--<div class="red">-->
<!--    <h2>Prochain événement</h2>-->
<!--    <p>Préparez-vous dès maintenant pour notre prochain évènement :</p>-->
<!--    <p>2ème VGM de l'ARM</p>-->
<!--    <a class="bouton" href="https://www.facebook.com/arm.haulchin.5">Plus d'infos sur facebook</a>-->
<!--</div>-->


<?php require_once("templates/footer.html"); ?>


</body>
</html>