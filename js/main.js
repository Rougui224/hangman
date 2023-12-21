import { mots,descriptions } from "./mots.js";
//**************** */ Variables ***************************
// Obtenir la racine de tous les elements pour gerer le theme
const root                           = document.documentElement
const body                           = document.body;
const boutonMode                     = document.querySelector('.information_jeu_mode')
const modal                          = document.querySelector('.modal')
const boutonModalOK                  = document.querySelector('.modal_boutons_ok')
const boutonModalNePlusAfficher      = document.querySelector('.modal_boutons_nePlusAfficher')
const backgroundModal                = document.querySelector('.bodyModalBackground')
const afficherMotATrouver            = document.querySelector('.motATrouver div')
const afficherDescription            = document.querySelector('.information_mot p')
const boutonRecommencer              = document.querySelector('.header_recommencer')
const clavier                        = document.querySelectorAll('.clavier button')
const afficherVie                    = document.querySelector('.information_jeu span')

// ***********fonctions et conditions***************************
 // Vérifier si le thème sombre est déjà activé via le localStorage
    if(localStorage.getItem('theme')){
        if(localStorage.getItem('theme') =='sombre'){
            modeSombre()
        }
    }

// Vérification si l'utilisateur a choisi de masquer le modal précédemment
    if(localStorage.getItem('NePlusAfficher')){
        fermerModal()
    }else {
        afficherModal()
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
let motChoisi         =''
let description       =''
let lettres           =''
let jeuValide         =false
function genererNombreAleatoire( tableau){
    return  Math.floor(Math.random()* tableau)
}


function recommencerJeu(){
    do{ 
        variableAleatoire = genererNombreAleatoire(mots.length)
    }while(variableAleatoire == dernierIndex)

    const motsEnMajuscules     = mots.map(mot => mot.toUpperCase())

    motChoisi            = motsEnMajuscules[variableAleatoire]
    description    = descriptions[variableAleatoire]
    afficherMotATrouver.innerHTML=''
    afficherDescription.innerHTML=''

    for(let i=0 ; i<motChoisi.length; i++) {
        const bouton        = document.createElement('button')
        bouton.textContent  = '_'
        afficherMotATrouver.appendChild(bouton)
    }
    lettres = document.querySelectorAll('.motATrouver button')
    afficherDescription.innerHTML=`" ${description} "` 
    console.log(motChoisi)
    clavier.forEach(bouton =>{
        bouton.classList.remove('boutonValide')
        bouton.classList.remove('boutonNonValide')
    })
}
function verifierJeu(){
    
    recommencerJeu()

    clavier.forEach(bouton =>{
       
        bouton.addEventListener('click', (event)=>{
            const bouton = event.target
            const lettre = bouton.value.toUpperCase()
            if(motChoisi.includes(lettre)){
                bouton.classList.add('boutonValide')
                for(let i=0; i<motChoisi.length; i++){

                    if(motChoisi[i]===lettre){
                        console.log(lettres)

                        lettres[i].textContent=lettre
                        lettres[i].classList.add('boutonValide')
                    }
                }
                // trier le tableau des lettres et sortir tous les boutons des lettres qui n'ont pas été trouvé
                jeuValide = Array.from(lettres).some(bouton => bouton.textContent ==='_')
                // si toutes les lettres sont trouvées, alors le joueur  a gagné
                if(!jeuValide){
                    console.log('true')
                    recommencerJeu()
                }
            }else{
                vies--
                afficherVie.textContent=vies
                // trouver comment faire la fonction recommencer mot, factoriser au maximun son code, revoir tout ce qui doit se repeter
                bouton.classList.add('boutonNonValide')
                console.log('la lettre ne figure pas')
                if(vies==0){
                    recommencerJeu()
                    vies=7
                    afficherVie.textContent=vies

                }
            }
        })
    })
   
    afficherVie.textContent=vies
    dernierIndex=variableAleatoire

}
verifierJeu()
// ************** Les evenements *************************
// Écouteur d'événement pour le bouton de commutation de thème
boutonMode.addEventListener('click', gerertheme)
boutonModalOK.addEventListener('click', fermerModal)
boutonModalNePlusAfficher.addEventListener('click', ()=>{
    localStorage.setItem('NePlusAfficher', 'true')
    fermerModal()
})
boutonRecommencer.addEventListener('click', verifierJeu)
// window.addEventListener('load', ()=>{
//     const cacherModal =
// })
