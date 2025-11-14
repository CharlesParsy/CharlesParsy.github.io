<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Notre bière</title>
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>

<?php require_once("templates/header.html"); ?>

<h1>Notre bière</h1>

<img class="piece" src="ARMbeer.png" alt="img ARM">

<div class="bulle">
    <p class="txt">La Haulchinoise est une bière Pale Ale</p>

</div>

<div class="black">
    <h2>La Haulchinoise</h2>
    <p class="txt">Depuis 2023, cette bière locale accompagne nos sorties et événements.
        Alliant les attributs d’un malt clair (notes céréalières, biscuitées) et les saveurs
        plus exotiques du houblon et de la levure. Elle est brassée à la demande des membres
        de l’ARM Haulchin à la brasserie Au Delà à Valenciennes.
    </p>

    <h2>Brasserie Au-Delà</h2>
    <div>
        <a class="bouton" href="https://www.instagram.com/brasserieaudela/">Instagram</a>
        <a class="bouton" href="https://www.facebook.com/brasserieaudela">Facebook</a>
    </div>
    <br><br>
</div>

<?php require_once("templates/footer.html"); ?>



</body>
</html>