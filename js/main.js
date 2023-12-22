'use strict'
import { mots,descriptions } from "./mots.js";
//**************** */ Variables ***************************
// Obtenir la racine de tous les elements pour gerer le theme
const root                           = document.documentElement
// les autres éléments html
const body                           = document.body;
const boutonMode                     = document.querySelector('.information_jeu_mode')
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
const clavier                        = document.querySelectorAll('.clavier button')
const afficherVie                    = document.querySelector('.information_jeu_vies span')
const afficherScore                  = document.querySelector('.information_jeu_score span')
const afficherRecord                 = document.querySelector('.information_jeu_record span')
const acheterUneLettre               = document.querySelector('.information_jeu_AcheterUneVie button')
const afficherResultat               = document.querySelector('.modalResultat')
const h3                             = document.querySelector('.modalResultat h3')
const p                              = document.querySelector('.modalResultat p')
const boutonModalResultat                         = document.querySelector('.modalResultat button')

// ***************Stockage de l'etat du jeu *************************
window.addEventListener('load', ()=>{
    // Vérifier si le thème sombre est déjà activé via le localStorage
    if(localStorage.getItem('theme')){
        if(localStorage.getItem('theme') =='sombre'){
            modeSombre()
        }
    }

    // Vérification si l'utilisateur a choisi de ne plus afficher le modal de BIENVENU
    if(localStorage.getItem('NePlusAfficher')){
        fermerModal()
    }else {
        afficherModal()
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
        console.log('score stocké au debut de la page ' + score)
    }
    // Verifier si l'utilisateur n'avait pas terminé de trouver les lettres avant de quitter le jeu, pour lui permettre de recommencer là ou il s'etait limité
    if(localStorage.getItem('etatJeu')){
        const etatJeu = localStorage.getItem('etatJeu');
        const etat = JSON.parse(etatJeu)
        console.log(etat)
        // Restaurer le mot avec les lettres déjà trouvées
        motChoisi          = etat.motChoisi
        description        = etat.description
        lettresIncorrectes = etat.lettresIncorrectes
        const lettresSauvegardees = etat.lettresDejaTrouvees;
        console.log(lettresSauvegardees)
        for (let i = 0; i < motChoisi.length; i++) {
            const bouton = document.createElement('button');
            bouton.textContent = lettresSauvegardees[i] !== '_' ? lettresSauvegardees[i] : '_';
            afficherMotATrouver.appendChild(bouton);
        }
        lettres = document.querySelectorAll('.motATrouver button')
        console.log(lettres)
        // remetre le style des boutons
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
        lettresIncorrectes.forEach(lettre =>{
            clavier.forEach(bouton =>{
                if(bouton.textContent === lettre){
                    bouton.classList.add('boutonNonValide')
                    bouton.disabled = true
                }
            })
        })
        afficherDescription.innerHTML=`" ${description} "` 
        // Restaurer le nombre de vies
        vies = etat.vies;
        afficherVie.textContent = vies;
    }else{
        recommencerJeu()
    }
})
// ***********fonctions et conditions***************************
 

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

    // Ajoute ou supprime la classe 'mode-sombre' du body

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
function afficherModal(){
    modal.style.display ='flex'
    backgroundModal.style.display ='block'
}
function fermerModal(){
    modal.style.display ='none'
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
let variableAleatoireAchete , IndicesAchetes=[]
const audioBoutonValide    = new Audio('../audio/boutonValide.m4a')
const audioBoutonNonValide = new Audio('../audio/boutonNonValide.m4a')
const audioFelicitation    = new Audio('../audio/jeuGagne.mp3')
const audioDommage         = new Audio('../audio/jeuPerdu.mp3')
function genererNombreAleatoire( tableau){
    return  Math.floor(Math.random()* tableau)
}
function mettreAjourScore(){
    score = 0
    localStorage.setItem('score', score)
    afficherScore.textContent = score
    console.log('score stocké dans la fonction miseAJourScore ' + score)

}

function motTrouve(){
    afficherResultat.style.display ='flex'
    score++
    localStorage.setItem('score', score)
    afficherScore.textContent = score
    console.log('score stocké dans fonction mot trouver, ' + score)

    if(score> record){
       record++
       afficherRecord.textContent = record
       localStorage.setItem('record', record)
    }
    audioBoutonValide.pause()
    audioBoutonValide.currentTime =0
    audioFelicitation.play()
    h3.textContent     =`🎉🎉🎉🎉🎉 Félicitations 🎉🎉🎉🎉`
    p.textContent      = `Vous avez gagné ! Vous avez deviné le mot ${motChoisi}. Bravo pour cette performance impressionnante ! `
    boutonModalResultat.textContent = `Continuer`
}
function motNonTrouver(){
    mettreAjourScore()
    afficherResultat.style.display ='flex'
    audioDommage.play()
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
    console.log(motChoisi)
    description          = descriptions[variableAleatoire]
    afficherMotATrouver.innerHTML=''
    afficherDescription.innerHTML=''

    for(let i=0 ; i<motChoisi.length; i++) {
        const bouton        = document.createElement('button')
        bouton.textContent  = '_'
        afficherMotATrouver.appendChild(bouton)
    }
    lettres = document.querySelectorAll('.motATrouver button')
    afficherDescription.innerHTML=`" ${description} "` 
    clavier.forEach(bouton =>{
        bouton.classList.remove('boutonValide')
        bouton.classList.remove('boutonNonValide')
        bouton.disabled = false;
    })
    vies=7
    afficherVie.textContent=vies
    IndicesAchetes=[]
    lettresIncorrectes =[]
    dernierIndex = variableAleatoire
   
}
let lettresIncorrectes =[]
function sauvegarderEtatJeu(){
    const lettresDejaTrouvees = Array.from(lettres).map(bouton => {
        return bouton.classList.contains('boutonValide')? bouton.textContent : '_'
    }).join('')
    const etatJeu = {
        motChoisi,
        description,
        lettresDejaTrouvees,
        vies,
        lettresIncorrectes: lettresIncorrectes
    }
    // on sauvegarde l'etat actuel du jeu
    localStorage.setItem('etatJeu', JSON.stringify(etatJeu));
   return etatJeu
    
}
function verifierJeu(){

    clavier.forEach(bouton =>{
       
        bouton.addEventListener('click', (event)=>{
            const bouton = event.target
            const lettre = bouton.value.toUpperCase()
            if(motChoisi.includes(lettre)){
                audioBoutonValide.play()
                bouton.classList.add('boutonValide')
                bouton.disabled = true;
                for(let i=0; i<motChoisi.length; i++){

                    if(motChoisi[i]===lettre){
                        // Ajouter la lettre au tableau des indices qui sont deja trouver pour eviter que l'utilisateur achete  l'indice qu'il a deja trouvé

                        IndicesAchetes.push(i)

                        lettres[i].textContent=lettre
                        lettres[i].classList.add('boutonValide')
                        console.log(sauvegarderEtatJeu())

                    }
                }
                // Cette fonction returne true s'il y a un bouton qui contient '_' , et false s'il n'ya plus de bouton qui contient '_'
                jeuNonValide = Array.from(lettres).some(bouton => bouton.textContent ==='_')
                // si toutes les lettres sont trouvées, alors le joueur  a gagné
                if(!jeuNonValide){                    
                    motTrouve()
                    console.log(jeuNonValide)

                }
            }else{
                audioBoutonNonValide.play()
                audioBoutonNonValide.volume = 0.6
                lettresIncorrectes.push(bouton.textContent)
                vies--
                afficherVie.textContent=vies
                bouton.disabled = true;
                console.log(sauvegarderEtatJeu())
                bouton.classList.add('boutonNonValide')
                if(vies===0){
                    motNonTrouver()

                }
            }
        })
    })
   
    afficherVie.textContent=vies
    dernierIndex=variableAleatoire

}
function genererNombreAleatoireAcheter(){
    return  Math.floor(Math.random()*motChoisi.length)
}

// ************** Les evenements *************************
// Écouteur d'événement pour le bouton de commutation de thème
boutonMode.addEventListener('click', gerertheme)
boutonModalOK.addEventListener('click', fermerModal)
boutonModalNePlusAfficher.addEventListener('click', ()=>{
    localStorage.setItem('NePlusAfficher', 'true')
    fermerModal()
})
boutonRecommencer.addEventListener('click',()=>{
    mettreAjourScore()
    console.log(score)
    console.log(localStorage.getItem('score'))
    localStorage.removeItem('etatJeu')
    recommencerJeu()
})
boutonProposerMot.addEventListener('click', ()=>{
    ModalProposerMot.style.display = 'flex'
})
quitterModalProposerMot.addEventListener('click', ()=>{
    ModalProposerMot.style.display = 'none'
})

boutonModalResultat.addEventListener('click', ()=>{
    audioFelicitation.pause()
    audioFelicitation.currentTime=0
    audioDommage.pause()
    audioDommage.currentTime=0
    afficherResultat.style.display ='none'
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
        console.log(variableAleatoireAchete)

        // Sécuriser 
        let lettreAchetee = motChoisi[variableAleatoireAchete]
        let occurences    = motChoisi.split(lettreAchetee).length-1
        console.log('voici l\'occurence de la lettre acheter '+ occurences)

        if(occurences ===1){
            clavier.forEach(bouton => {
                if (bouton.textContent.toUpperCase() === lettreAchetee) {
                    bouton.disabled = true;
                    bouton.classList.add('boutonValide')

                }
            });
        }
    }
    console.log(IndicesAchetes)

})
verifierJeu()


// window.addEventListener('load', ()=>{
//     const cacherModal =
// })
