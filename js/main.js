'use strict'
import { mots,descriptions } from "./mots.js";
//**************** */ Variables ***************************
// Obtenir la racine de tous les elements pour gerer le theme
const root                           = document.documentElement
// les autres éléments html
const body                           = document.body;
const boutonMode                     = document.querySelector('.information_jeu_mode')
const boutonVolume                   = document.querySelector('.information_jeu_volume')
const iconVolumeActive               = document.querySelector('.information_jeu_volume .fa-volume-high')
const iconVolumeDesactive            = document.querySelector('.information_jeu_volume .fa-volume-xmark')
const modal                          = document.querySelector('.modal')
const boutonModalOK                  = document.querySelector('.modal_boutons_ok')
const boutonModalNePlusAfficher      = document.querySelector('.modal_boutons_nePlusAfficher')
const backgroundModal                = document.querySelector('.bodyModalBackground')
const afficherMotATrouver            = document.querySelector('.motATrouver div')
const afficherDescription            = document.querySelector('.information_mot p')
const boutonRecommencer              = document.querySelector('.header_recommencer')
const boutonProposerMot              = document.querySelector('.header_proposerUnMot')
const ModalProposerMot               = document.querySelector('.modalFormulaireProposerMot')
const quitterModalProposerMot        = document.querySelector('.modalFormulaireProposerMot .fa-x')
const formModalProposerMot           = document.querySelector('.modalFormulaireProposerMot ')
const ModalMessage                   = document.querySelector('.modalMessage ')
const ModalMessageTitle              = document.querySelector('.modalMessage h3 ')
const ModalMessageP                  = document.querySelector('.modalMessage p ')
const ModalMessageBouton             = document.querySelector('.modalMessage button')
const clavier                        = document.querySelectorAll('.clavier button')
const afficherVie                    = document.querySelector('.information_jeu_vies span')
const afficherScore                  = document.querySelector('.information_jeu_score span')
const afficherImage                 = document.querySelector('.information_image img')

const afficherRecord                 = document.querySelector('.information_jeu_record span')
const acheterUneLettre               = document.querySelector('.information_jeu_AcheterUneVie button')
const afficherResultat               = document.querySelector('.modalResultat')
const h3                             = document.querySelector('.modalResultat h3')
const p                              = document.querySelector('.modalResultat p')
const boutonModalResultat            = document.querySelector('.modalResultat button')

// ***************Stockage de l'etat du jeu *************************
window.addEventListener('load', ()=>{
    // Vérifier si le volume est active
    if(localStorage.getItem('volume')){
        volumeActive = localStorage.getItem('volume')
        if(volumeActive ==='true'){
            activerSon()
        }else{
           
            desactiverSon()
        }
    }
    // Vérifier si le thème sombre est déjà activé via le localStorage
    if(localStorage.getItem('theme')){
        if(localStorage.getItem('theme') =='sombre'){
            modeSombre()
        }
    }

    // Vérification si l'utilisateur a choisi de ne plus afficher le modal de BIENVENU
    if(localStorage.getItem('NePlusAfficher')){
        fermerElement(modal)
    }else {
        afficherElement(modal)
    }
    // Verifier si un record existe deja 
    if(localStorage.getItem('record')){
        record = localStorage.getItem('record')
        afficherRecord.textContent=record

    }
    // Verifier si un score existe deja
    if(localStorage.getItem('score')){
        score = localStorage.getItem('score')
        afficherScore.textContent = score
    }
    // Verifier si l'utilisateur n'avait pas terminé de trouver les lettres avant de quitter le jeu, pour lui permettre de recommencer là ou il s'etait limité
    if(localStorage.getItem('etatJeu')){
        const etatJeu = localStorage.getItem('etatJeu');
        let lettresDejaTrouvees ;
        // Recuperer la sauvegarde de toutes les variables
        ({motChoisi,description,lettresIncorrectes,IndicesAchetes,vies,lettresDejaTrouvees}= JSON.parse(etatJeu)) 
        afficherDescription.innerHTML=`" ${description} "` 
        // Restaurer le nombre de vies
        mettreAJourImageEtVies()
        // Afficher le mot à trouver
        for (let i = 0; i < motChoisi.length; i++) {
            const bouton = document.createElement('button');
            bouton.textContent = lettresDejaTrouvees[i];
            afficherMotATrouver.appendChild(bouton);
        }
        lettres = document.querySelectorAll('.motATrouver button')
        // remetre le style des boutons du mot
        let lettreClavier
        lettres.forEach(bouton=>{
            
            if(bouton.textContent!='_'){
                bouton.classList.add('boutonValide')
                lettreClavier = bouton.textContent
                clavier.forEach(bouton =>{
                    if(bouton.textContent === lettreClavier){
                        bouton.classList.add('boutonValide')
                        bouton.disabled = true
                    }
                })
            }
        })
        // remetre le style des boutons du clavier
        lettresIncorrectes.forEach(lettre =>{
            clavier.forEach(bouton =>{
                if(bouton.textContent === lettre){
                    bouton.classList.add('boutonNonValide')
                    bouton.disabled = true
                }
            })
        })
        // Vérifier si une lettre a été achetée et est présente plusieurs fois dans le mot que l'utilisateur ignore
        if(IndicesAchetes.length>0){
            // Parcourir les lettres déjà achetées
            IndicesAchetes.forEach(indice =>{
                const lettreAchetee = motChoisi[indice]
                // Compter le nombre d'occurrences de la lettre achetée dans le mot
                const occurences    = motChoisi.split(lettreAchetee).length-1
                //  Si la lettre est présente plusieurs fois 
                if (occurences > 1 ) {
                    const indicesLettre = [];
                    // Trouver tous les indices où la lettre achetée se trouve dans le mot
                    for (let i = 0; i < motChoisi.length; i++) {
                        if (motChoisi[i] === lettreAchetee) {
                            indicesLettre.push(i);
                        }
                    }
                    // Vérifier si un bouton correspondant à cette lettre n'a pas encore été découvert
                    const indiceLettreNonDecouvert = indicesLettre.find((index) => lettres[index].textContent === '_');
                    // indiceLettreNonDecouvert retourne undefined si l'utilasateur a deja entré la lettre dans le clavier                
                    if(indiceLettreNonDecouvert !== undefined){
                         // Annuler le style de cette lettre
                        clavier.forEach((bouton) => {
                            if (bouton.textContent.toUpperCase() === lettreAchetee) {
                                bouton.disabled = false;
                                bouton.classList.remove('boutonValide');
                            }
                        });
                    }

                }

            })
        }
        verifierMotTrouve()
      
    }else{
        recommencerJeu()
    }
})
// ***********fonctions et conditions**************************
let volumeActive = true
function desactiverSon(){
    iconVolumeActive.style.display ='none'
    iconVolumeDesactive.style.display ='inline'
    audioBoutonNonValide.pause()
    audioBoutonValide.pause()
    audioDommage.pause()
    audioFelicitation.pause()
    volumeActive = false

}
function activerSon(){
    iconVolumeActive.style.display ='inline'
    iconVolumeDesactive.style.display ='none'
    volumeActive = true
}
function gererVolume(){
    if(volumeActive){
       desactiverSon()

    }
    else {
        activerSon()
    }
    localStorage.setItem('volume',volumeActive.toString())
}
function jouerSon(audio){
    if(volumeActive){
        audio.currentTime =0
       const playPromise = audio.play()
       if(playPromise !== undefined){
            playPromise.then(() =>{
                // audio.pause()
            }).catch(error => {
                console.log('errur lors de la lecture du son :', error)
            })
        }
    }
}

function modeSombre(){

    body.className='mode-sombre'
    root.style.setProperty('--colorPrimaire','#211717')
    root.style.setProperty('--colorQuaternaire','#dfddc7')
    root.style.setProperty('--colorTertiaire','#f58b54')
    root.style.setProperty('--colorSecondaire','#a34a28')
    boutonMode.style.justifyContent='flex-end'
    localStorage.setItem('theme','sombre')
}

function gerertheme(){

    // Mettre à jour les variables CSS en fonction du thème choisi
    if(body.classList.contains('mode-sombre')){

        body.className=''
        root.style.setProperty('--colorPrimaire','#dfddc7')
        root.style.setProperty('--colorQuaternaire','#211717')
        root.style.setProperty('--colorTertiaire','#a34a28')
        root.style.setProperty('--colorSecondaire','#f58b54')
        boutonMode.style.justifyContent='start'
        localStorage.setItem('theme','claire')
    }else {
       modeSombre()
    }

}



function afficherElement(element){
    element.style.display ='flex'
    backgroundModal.style.display ='block'
}
function fermerElement(element){
    element.style.display ='none'
    backgroundModal.style.display ='none'
}


// **********************jeu*****************************
let dernierIndex      = 0
let variableAleatoire = 0
let vies              = 7
let record            = 0
let score             = 0
let motChoisi         = ''
let description       = ''
let lettres           = ''
let jeuNonValide      = true
let variableAleatoireAchete , IndicesAchetes=[], lettresIncorrectes =[]

const audioBoutonValide    = new Audio('./audio/boutonValide.m4a')
const audioBoutonNonValide = new Audio('./audio/boutonNonValide.m4a')
const audioFelicitation    = new Audio('./audio/jeuGagne.mp3')
const audioDommage         = new Audio('./audio/jeuPerdu.mp3')

function genererNombreAleatoire( tableau){
    return  Math.floor(Math.random()* tableau)
}
function mettreAjourScore(){
    score = 0
    localStorage.setItem('score', score)
    afficherScore.textContent = score

}
function mettreAJourImageEtVies(){
    afficherVie.textContent=vies
    afficherImage.src= `images/image-${vies}.png`
}
function verifierMotTrouve(){
    jeuNonValide = Array.from(lettres).some(bouton => bouton.textContent ==='_')

    if(!jeuNonValide){                    
        motTrouve()

    }
}
function motTrouve(){
    setTimeout( ()=>{afficherElement(afficherResultat)},1000)
   
    score++
    localStorage.setItem('score', score)
    afficherScore.textContent = score

    if(score> record){
       record++
       afficherRecord.textContent = record
       localStorage.setItem('record', record)
    }
    jouerSon(audioFelicitation)
    h3.textContent     =`🎉🎉🎉🎉🎉 Félicitations 🎉🎉🎉🎉`
    p.textContent      = `Vous avez gagné ! Vous avez deviné le mot ${motChoisi}. Bravo pour cette performance impressionnante ! `
    boutonModalResultat.textContent = `Continuer`
}
function motNonTrouver(){
    mettreAjourScore()
    setTimeout(()=>{afficherElement(afficherResultat)},1000)
    jouerSon(audioDommage)
    h3.textContent     =`😔😔 Dommage 😔😔`
    p.textContent      = `Vous avez perdu. Le mot était ${motChoisi}. Ne vous découragez pas, essayez à nouveau et vous finirez par réussir !  ! `
    boutonModalResultat.textContent = `Recommencer`

}

function recommencerJeu(){
    do{ 
        variableAleatoire = genererNombreAleatoire(mots.length)
    }while(variableAleatoire == dernierIndex)

    const motsEnMajuscules     = mots.map(mot => mot.toUpperCase())

    motChoisi            = motsEnMajuscules[variableAleatoire]
    description          = descriptions[variableAleatoire]
    afficherMotATrouver.innerHTML=''
    afficherDescription.innerHTML=''
    afficherDescription.innerHTML=`" ${description} "` 

    // Créer les boutons en fonction de la taille du mot pour pouvoir afficher le mot
    for(let i=0 ; i<motChoisi.length; i++) {
        const bouton        = document.createElement('button')
        bouton.textContent  = '_'
        afficherMotATrouver.appendChild(bouton)
    }
    // recuperer les boutons pour pouvoir les utiliser dans la fonction verifierJeu()
    lettres = document.querySelectorAll('.motATrouver button')

    // reinitialiser le style de tous les boutons
    clavier.forEach(bouton =>{
        bouton.classList.remove('boutonValide')
        bouton.classList.remove('boutonNonValide')
        bouton.disabled = false;
    })
    vies=7
    IndicesAchetes=[]
    lettresIncorrectes =[]
    dernierIndex = variableAleatoire
    mettreAJourImageEtVies()
   
}
function sauvegarderEtatJeu(){
    const lettresDejaTrouvees = Array.from(lettres).map(bouton => {
        return bouton.classList.contains('boutonValide')? bouton.textContent : '_'
    }).join('')
    const etatJeu = {
        motChoisi,
        description,
        lettresDejaTrouvees,
        vies,
        lettresIncorrectes,
        IndicesAchetes
    }
    // on sauvegarde l'etat actuel du jeu
    localStorage.setItem('etatJeu', JSON.stringify(etatJeu));
   return etatJeu
    
}
function verifierJeu(){
    // Ecouteur d'evenement sur toutes les lettres
    clavier.forEach(bouton =>{   
        bouton.addEventListener('click', (event)=>{
            const bouton = event.target
            const lettre = bouton.value.toUpperCase()
            // Si le mot contient la lettre choisie
            if(motChoisi.includes(lettre)){
                jouerSon(audioBoutonValide)
                bouton.classList.add('boutonValide')
                bouton.disabled = true;
                // Afficher la lettre
                for(let i=0; i<motChoisi.length; i++){
                    if(motChoisi[i]===lettre){
                        // Ajouter la lettre au tableau des indices qui sont deja trouver pour eviter que l'utilisateur achete  l'indice qu'il a deja trouvé
                        IndicesAchetes.push(i)
                        lettres[i].textContent=lettre
                        lettres[i].classList.add('boutonValide')
                        sauvegarderEtatJeu()
                    }
                }
                verifierMotTrouve()
            }
            // Sinon
            else{
                jouerSon(audioBoutonNonValide)
                audioBoutonNonValide.volume = 0.6
                bouton.classList.add('boutonNonValide')
                lettresIncorrectes.push(bouton.textContent)
                vies--
                bouton.disabled = true;
                mettreAJourImageEtVies()
                sauvegarderEtatJeu()
                if(vies===0){
                   mettreAJourImageEtVies()
                    motNonTrouver()
                }
            }
        })
    }) 
    afficherVie.textContent=vies
    afficherRecord.textContent=record
    afficherScore.textContent = score
    dernierIndex=variableAleatoire
}
function genererNombreAleatoireAcheter(){
    return  Math.floor(Math.random()*motChoisi.length)
}

// ************** Les evenements *************************
boutonVolume.addEventListener('click', gererVolume)
// Écouteur d'événement pour le bouton de commutation de thème
boutonMode.addEventListener('click', gerertheme)
boutonModalOK.addEventListener('click', ()=> fermerElement(modal))
boutonModalNePlusAfficher.addEventListener('click', ()=>{
    localStorage.setItem('NePlusAfficher', 'true')
    fermerElement(modal)
})
boutonRecommencer.addEventListener('click',()=>{
    mettreAjourScore()
    localStorage.removeItem('etatJeu')
    recommencerJeu()
})
boutonProposerMot.addEventListener('click', ()=>{
    afficherElement(ModalProposerMot)
})
quitterModalProposerMot.addEventListener('click', ()=>{
    fermerElement(ModalProposerMot)
})

boutonModalResultat.addEventListener('click', ()=>{
    audioFelicitation.pause()
    audioDommage.pause()
    fermerElement(afficherResultat)
    localStorage.removeItem('etatJeu')
    recommencerJeu()
})

acheterUneLettre.addEventListener('click', ()=>{
    if(vies>2){
        vies-=2
        afficherVie.textContent = vies
        do{
            variableAleatoireAchete = genererNombreAleatoireAcheter()

        }while(IndicesAchetes.includes(variableAleatoireAchete))
        audioBoutonValide.play()
        // Afficher la lettre et personnaliser le style
        lettres[variableAleatoireAchete].textContent= motChoisi[variableAleatoireAchete]
        lettres[variableAleatoireAchete].classList.add('boutonValide')
        // Ajouter la lettre au tableau des indices qui sont deja trouver pour eviter que l'utilisateur achete 2fois le même indice
        IndicesAchetes.push(variableAleatoireAchete)

        // Sécuriser le style du bouton
        let lettreAchetee = motChoisi[variableAleatoireAchete]
        let occurences    = motChoisi.split(lettreAchetee).length-1
        sauvegarderEtatJeu()
        // si la lettre acheter ne figure qu'une seule fois dans le mot, 
        if(occurences ===1){
            clavier.forEach(bouton => {
                // Désactiver la lettre dans le clavier et changer le style du bouton
                if (bouton.textContent.toUpperCase() === lettreAchetee) {
                    bouton.disabled = true;
                    bouton.classList.add('boutonValide')

                }
                // sinon, on fait rien, pour ne pas permettre à l'utilisateur d'acheter deux lettres au lieu d'une seule
            });
        }
       verifierMotTrouve()

    }
    else{
        afficherElement(ModalMessage)
        ModalMessageTitle.textContent =` 😕 Vies Insuffisantes 😕`
        ModalMessageP.textContent =`Vous avez besoin d'au moins trois vies pour acheter une lettre. Vous n'en avez pas assez pour le moment. Revenez lorsque vous aurez collecté davantage de vies !`
    }

})
formModalProposerMot.addEventListener('submit', (event)=>{
    event.preventDefault()
    const mot = event.target.querySelector('[name=mot]').value
    const description = event.target.querySelector('[name=description]').value
    fermerElement(formModalProposerMot)
    afficherElement(ModalMessage)
    ModalMessageTitle.textContent =` Proposer mot`
    ModalMessageP.textContent =`Merci pour votre proposition ! Nous allons évaluer le mot "${mot}" avec la description <<${description}>> et envisager de l'ajouter au jeu`
})
ModalMessageBouton.addEventListener('click', ()=>{
    fermerElement(ModalMessage)
})
verifierJeu()



